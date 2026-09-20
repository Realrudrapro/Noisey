const alertSound = new Audio("noisey.mp3");

let analyser;
let data;
let alertPlaying = false;
let audioContext;
let microphoneStream;

alertSound.addEventListener("play", () => {
  alertPlaying = true;
});

alertSound.addEventListener("ended", () => {
  alertPlaying = false;
});

document.getElementById("start").addEventListener("click", async () => {
  try {
    microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    audioContext = new AudioContext();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    try {
      alertSound.volume = 1;
      alertSound.currentTime = 0;
      await alertSound.play();
      alertSound.pause();
      alertSound.currentTime = 0;
      alertPlaying = false;
    } catch (audioError) {
      console.error("Alert sound error:", audioError);
    }

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