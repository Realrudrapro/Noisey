async function initAudio() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);
  
  const data = new Uint8Array(analyser.fftSize);

  function checkSound() {
    analyser.getByteTimeDomainData(data);
    let volume = 0;
    for (let i = 0; i < data.length; i++) {
      volume += Math.abs(data[i] - 128);
    }
    volume /= data.length;
    
    if (volume > 20) {
      console.log("LOUD SOUND!");
    }
    requestAnimationFrame(checkSound);
  }
  
  checkSound();
}

initAudio();
