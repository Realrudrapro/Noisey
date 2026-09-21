window.Noisey = window.Noisey || {};

// Cache the element once instead of looking it up every animation frame
Noisey.warningEl = null;

Noisey.checkSound = function () {
    Noisey.analyser.getByteTimeDomainData(Noisey.data);

    let sum = 0;

    for (let i = 0; i < Noisey.data.length; i++) {
        const normalized = (Noisey.data[i] - 128) / 128;
        sum += normalized * normalized;
    }

    const volume = Math.sqrt(sum / Noisey.data.length);

    // Guard against a missing/mistyped element instead of throwing
    // and silently killing the whole detection loop
    if (Noisey.warningEl) {
        if (volume > 0.2) {
            Noisey.warningEl.textContent = "TOO LOUD";

            if (!Noisey.alertPlaying) {
                Noisey.alertSound.currentTime = 0;

                Noisey.alertSound.play().catch(() => {
                    Noisey.alertPlaying = false;
                });
            }
        } else {
            Noisey.warningEl.textContent = "";
        }
    }

    Noisey.rafId = requestAnimationFrame(Noisey.checkSound);
};

Noisey.stopChecking = function () {
    if (Noisey.rafId) {
        cancelAnimationFrame(Noisey.rafId);
        Noisey.rafId = null;
    }
};