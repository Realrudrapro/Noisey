window.Noisey = window.Noisey || {};

Noisey.checkSound = function () {
    Noisey.analyser.getByteTimeDomainData(Noisey.data);

    let sum = 0;

    for (let i = 0; i < Noisey.data.length; i++) {
        const normalized = (Noisey.data[i] - 128) / 128;
        sum += normalized * normalized;
    }

    const volume = Math.sqrt(sum / Noisey.data.length);
    const warning = document.getElementById("2623221602");

    if (volume > 0.2) {
        warning.textContent = "TOO LOUD";

        if (!Noisey.alertPlaying) {
            Noisey.alertSound.currentTime = 0;

            Noisey.alertSound.play().catch(() => {
                Noisey.alertPlaying = false;
            });
        }
    } else {
        warning.textContent = "";
    }

    requestAnimationFrame(Noisey.checkSound);
};