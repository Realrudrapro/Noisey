function checkSound() {
    analyser.getByteTimeDomainData(data);

    let sum = 0;

    for (let i = 0; i < data.length; i++) {
        const normalized = (data[i] - 128) / 128;
        sum += normalized * normalized;
    }

    const volume = Math.sqrt(sum / data.length);

    if (volume > 0.2 && !noiseyAudio.alertPlaying) {
        noiseyAudio.alertSound.currentTime = 0;
        noiseyAudio.alertSound.play().catch(err => {
            console.error("Alert sound error:", err);
        });
    }

    requestAnimationFrame(checkSound);
}