function checkSound() {
    analyser.getByteTimeDomainData(data);

    let sum = 0;

    for (let i = 0; i < data.length; i++) {
        const normalized = (data[i] - 128) / 128;
        sum += normalized * normalized;
    }

    const volume = Math.sqrt(sum / data.length);
    const warning = document.getElementById("2623221602");

    if (volume > 0.2) {
        warning.textContent = "TOO LOUD";

        if (!alertPlaying) {
            alertPlaying = true;
            alertSound.currentTime = 0;

            alertSound.play().catch(() => {
                alertPlaying = false;
            });
        }
    } else {
        warning.textContent = "";
    }

    requestAnimationFrame(checkSound);
}