const startButton = document.getElementById("start");
const element = document.getElementById("message");
const sensitivity = document.getElementById("sensitivity");

const alertSound = new Audio("noisey.mp3");
alertSound.preload = "auto";

let alertPlaying = false;
let clearTimer = null;
let analyser;
let data;
let audioContext;

alertSound.addEventListener("play", () => {
  alertPlaying = true;
});

alertSound.addEventListener("ended", () => {
  alertPlaying = false;
});

startButton.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    audioContext = new AudioContext();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);

    data = new Uint8Array(analyser.fftSize);

    await alertSound.play();
    alertSound.pause();
    alertSound.currentTime = 0;

    startButton.disabled = true;
    startButton.textContent = "Listening...";

    checkSound();

  } catch (err) {
    console.error("Permission/audio error:", err);
  }
});

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

    if (!alertPlaying) {
      alertSound.currentTime = 0;

      alertSound.play().catch(err => {
        console.log("Audio playback interrupted:", err);
      });
    }

    if (clearTimer) {
      clearTimeout(clearTimer);
      clearTimer = null;
    }

  } else {
    if (!clearTimer && element.textContent !== "") {
      clearTimer = setTimeout(() => {
        element.textContent = "";
        clearTimer = null;
      }, 3000);
    }
  }

  requestAnimationFrame(checkSound);
}