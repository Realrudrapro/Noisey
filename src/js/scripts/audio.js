window.Noisey = window.Noisey || {};

Noisey.alertSound = new Audio("noisey.mp3");
Noisey.alertPlaying = false;

Noisey.alertSound.addEventListener("play", () => {
    Noisey.alertPlaying = true;
});

Noisey.alertSound.addEventListener("ended", () => {
    Noisey.alertPlaying = false;
});