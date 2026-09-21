window.Noisey = window.Noisey || {};

const startBtn = document.getElementById("start");

startBtn.addEventListener("click", async () => {
    // Prevent double-start: duplicate mic streams, AudioContexts,
    // and detection loops if the button is clicked more than once
    if (Noisey.audioContext) {
        return;
    }

    startBtn.disabled = true;

    try {
        Noisey.microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        Noisey.audioContext = new AudioContext();

        if (Noisey.audioContext.state === "suspended") {
            await Noisey.audioContext.resume();
        }

        // Cache the warning element once here rather than every frame
        Noisey.warningEl = document.getElementById("2623221602");
        if (!Noisey.warningEl) {
            console.warn("Noisey: warning element not found in the DOM");
        }

        // Unlock audio playback on user gesture
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
        // Note: smoothingTimeConstant only affects getByteFrequencyData,
        // not getByteTimeDomainData, so it has no effect here. Left out
        // since it was a no-op in the original code.

        source.connect(Noisey.analyser);

        Noisey.data = new Uint8Array(Noisey.analyser.fftSize);

        Noisey.checkSound();
    } catch (err) {
        console.error("Permission/audio error:", err);

        // Roll back so a retry is possible after a failure
        Noisey.stopChecking();
        if (Noisey.microphoneStream) {
            Noisey.microphoneStream.getTracks().forEach((t) => t.stop());
            Noisey.microphoneStream = null;
        }
        if (Noisey.audioContext) {
            Noisey.audioContext.close();
            Noisey.audioContext = null;
        }
        startBtn.disabled = false;
    }
});