setupMilaPlayer();

function setupMilaPlayer() {
  const panel = document.querySelector('.mila-audio');
  const audio = panel.querySelector('audio');
  const controls = document.createElement('div');
  controls.className = 'demo-controls';
  controls.innerHTML = `
    <button class="demo-toggle" type="button" aria-label="Play Mila Voice demo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg></button>
    <div class="demo-track">
      <input class="demo-seek" type="range" min="0" max="167" step="0.1" value="0" aria-label="Seek in Mila Voice demo">
      <div class="demo-times"><span class="demo-time">0:00</span><span class="demo-duration">2:47</span></div>
    </div>
    <button class="demo-mute" type="button" aria-label="Mute audio" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Zm12-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg></button>`;
  panel.append(controls);
  audio.controls = false;
  panel.classList.add('mila-inline');
  connectPlayer(audio, controls);
}

function connectPlayer(audio, controls) {
  const toggle = controls.querySelector('.demo-toggle');
  const seek = controls.querySelector('.demo-seek');
  const mute = controls.querySelector('.demo-mute');
  const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const update = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 167;
    seek.max = duration;
    seek.value = audio.currentTime;
    seek.style.setProperty('--progress', `${audio.currentTime / duration * 100}%`);
    controls.querySelector('.demo-time').textContent = time(audio.currentTime);
    controls.querySelector('.demo-duration').textContent = time(duration);
    toggle.setAttribute('aria-label', audio.paused ? 'Play Mila Voice demo' : 'Pause Mila Voice demo');
    toggle.querySelector('path').setAttribute('d', audio.paused ? 'm9 5 11 7-11 7Z' : 'M6 5h4v14H6ZM14 5h4v14h-4Z');
  };
  toggle.addEventListener('click', async () => {
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); }
    catch { toggle.setAttribute('aria-label', 'Playback failed. Try playing the demo again.'); }
  });
  seek.addEventListener('input', () => { audio.currentTime = Number(seek.value); });
  mute.addEventListener('click', () => {
    audio.muted = !audio.muted;
    mute.setAttribute('aria-pressed', String(audio.muted));
    mute.setAttribute('aria-label', audio.muted ? 'Unmute audio' : 'Mute audio');
  });
  for (const event of ['timeupdate', 'loadedmetadata', 'play', 'pause', 'ended']) audio.addEventListener(event, update);
}
