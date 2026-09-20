window.Noisey = window.Noisey || {};

document.getElementById("start").addEventListener("click", async () => {
    try {
        Noisey.microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        Noisey.audioContext = new AudioContext();

        if (Noisey.audioContext.state === "suspended") {
            await Noisey.audioContext.resume();
        }

        Noisey.alertSound.volume = 1;
        Noisey.alertSound.currentTime = 0;

        await Noisey.alertSound.play();

        Noisey.alertSound.pause();
        Noisey.alertSound.currentTime = 0;
        Noisey.alertPlaying = false;

        const source = Noisey.audioContext.createMediaStreamSource(
            Noisey.microphoneStream
        );

        Noisey.analyser = Noisey.audioContext.createAnalyser();
        Noisey.analyser.fftSize = 512;
        Noisey.analyser.smoothingTimeConstant = 0.8;

        source.connect(Noisey.analyser);

        Noisey.data = new Uint8Array(Noisey.analyser.fftSize);

        Noisey.checkSound();
    } catch (err) {
        console.error("Permission/audio error:", err);
    }
});