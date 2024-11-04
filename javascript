const recordButton = document.getElementById("recordButton");
const stopButton = document.getElementById("stopButton");
const emotionOutput = document.getElementById("emotionOutput");

let recorder, audioBlob;

// Start recording
recordButton.onclick = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            recorder = new MediaRecorder(stream);
            recorder.start();
            recordButton.disabled = true;
            stopButton.disabled = false;

            recorder.ondataavailable = event => {
                audioBlob = event.data;
            };
        });
};

// Stop recording and send audio for analysis
stopButton.onclick = () => {
    recorder.stop();
    recordButton.disabled = false;
    stopButton.disabled = true;

    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        emotionOutput.textContent = `Emotion: ${data.emotion}, Confidence: ${data.confidence}`;
    })
    .catch(error => console.error("Error:", error));
};
