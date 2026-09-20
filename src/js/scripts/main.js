const alertSound = new Audio("");

alertSound.addEventListener("play", () => { alertPlaying = true; });
alertSound.addEventListener("ended", () => { alertPlaying = false; });

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
      alertSound.play().catch(err => console.log("Audio playback interrupted:", err));
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
