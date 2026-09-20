let analyser;
let data;
let audioContext;
let microphoneStream;

document.getElementById("start").addEventListener("click", async () => {
    try {
        microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audioContext = new AudioContext();

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        alertSound.volume = 1;
        alertSound.currentTime = 0;

        await alertSound.play();

        alertSound.pause();
        alertSound.currentTime = 0;
        alertPlaying = false;

        const source = audioContext.createMediaStreamSource(microphoneStream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;

        source.connect(analyser);

        data = new Uint8Array(analyser.fftSize);

        checkSound();
    } catch (err) {
        console.error("Permission/audio error:", err);
    }
});