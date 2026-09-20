window.noiseyAudio = {
    alertSound: new Audio("noisey.mp3"),
    alertPlaying: false
};

noiseyAudio.alertSound.addEventListener("play", () => {
    noiseyAudio.alertPlaying = true;
});

noiseyAudio.alertSound.addEventListener("ended", () => {
    noiseyAudio.alertPlaying = false;
});