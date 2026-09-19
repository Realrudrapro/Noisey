async function initAudio() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 1024;
        source.connect(analyser);

        const data = new Uint8Array(analyser.fftSize);
        const element = document.getElementById("2623221602");
        const sensitivity = document.getElementById("1534573029");
        const startButton = document.getElementById("start");

        let clearTimer = null;

        function checkSound() {
            analyser.getByteTimeDomainData(data);

            let sum = 0;

            for (let i = 0; i < data.length; i++) {
                const normalized = (data[i] - 128) / 128;
                sum += normalized * normalized;
            }

            const rms = Math.sqrt(sum / data.length);
            const volume = Math.min(100, Math.round(rms * 200));
            const maxVolume = Number(sensitivity.value);

            if (volume > maxVolume) {
                element.textContent = "TOO LOUD";

                if (clearTimer) {
                    clearTimeout(clearTimer);
                    clearTimer = null;
                }
            } else if (!clearTimer && element.textContent !== "") {
                clearTimer = setTimeout(() => {
                    element.textContent = "";
                    clearTimer = null;
                }, 3000);
            }

            requestAnimationFrame(checkSound);
        }

        startButton.disabled = true;
        startButton.textContent = "Microphone Active";

        checkSound();
    } catch (err) {
        console.error("Microphone access denied or not supported:", err);
    }
}

document.getElementById("start").addEventListener("click", initAudio);
