const alertSound = new Audio("noisey.mp3");

let alertPlaying = false;

alertSound.addEventListener("play", () => {
  alertPlaying = true;
});

alertSound.addEventListener("ended", () => {
  alertPlaying = false;
});