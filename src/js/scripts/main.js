document.getElementById("start").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    alertSound.volume = 1;
    await alertSound.play();
    alertSound.pause();
    alertSound.currentTime = 0;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);

    data = new Uint8Array(analyser.fftSize);

    checkSound();

  } catch (err) {
    console.error("Permission/audio error:", err);
  }
});