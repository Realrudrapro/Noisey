async function initAudio() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    
    const data = new Uint8Array(analyser.fftSize);
    const element = document.getElementById("2623221602");
    let clearTimer = null;

    function checkSound() {
      analyser.getByteTimeDomainData(data);
      let volume = 0;
      for (let i = 0; i < data.length; i++) {
        volume += Math.abs(data[i] - 128);
      }
      volume /= data.length;

      if (volume > 20) {
        if (clearTimer) clearTimeout(clearTimer);
        element.textContent = 'TOO LOUD';
      } else {
        if (!clearTimer && element.textContent) {
          clearTimer = setTimeout(() => {
            element.textContent = '';
            clearTimer = null;
          }, 3000);
        }
      }
      
      requestAnimationFrame(checkSound);
    }
    
    checkSound();
  } catch (err) {
    console.error("Microphone access denied or not supported:", err);
  }
}

initAudio();
