// Both captured homepage layouts use the same media-owned playback state.
export function initializeHomeHero(host, win) {
  const video = host.querySelector('video[poster*="wx-hero"]');
  const section = video && video.closest('section');
  if (!section || video.dataset.ahvHeroBound) return;
  video.dataset.ahvHeroBound = '1';
  const toggle = section.querySelector('button[aria-label*="background video"]');
  const chapters = Array.from(section.querySelectorAll('button')).filter(button => /^0[1-4] ·/.test(button.textContent.trim()));
  const times = [0, 8.067, 15.767, 22.834];
  const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)');
  let pendingChapter = null, wantsPlayback = false, attempt = 0;
  function selectChapter(index) {
    chapters.forEach((button, i) => {
      button.setAttribute('aria-current', i === index ? 'true' : 'false');
      button.style.setProperty('border-bottom-color', i === index ? '#eeb41e' : 'transparent', 'important');
      button.style.setProperty('color', i === index ? '#fff' : 'rgba(247,244,234,.68)', 'important');
    });
  }
  function syncChapter() {
    if (pendingChapter !== null) return;
    let current = 0;
    times.forEach((time, index) => { if (video.currentTime >= time) current = index; });
    selectChapter(current);
  }
  function syncPlayback() {
    if (!toggle) return;
    const playing = !video.paused && !video.ended && !video.error;
    const label = playing ? 'Pause background video' : 'Play background video';
    toggle.setAttribute('aria-label', label);
    toggle.textContent = (playing ? '❚❚ ' : '▶ ') + label;
  }
  function seekPendingChapter() {
    if (pendingChapter === null || video.readyState < 1) return;
    try { video.currentTime = times[pendingChapter]; pendingChapter = null; }
    catch (_) { /* Retry the latest requested chapter once metadata is ready. */ }
  }
  function play() {
    wantsPlayback = true;
    video.muted = true; video.defaultMuted = true; video.setAttribute('muted', '');
    video.playsInline = true; video.setAttribute('playsinline', '');
    if (!video.getAttribute('src')) video.setAttribute('src', '/ahv/assets/homepage-journey.mp4');
    seekPendingChapter();
    const request = ++attempt;
    try {
      const promise = video.play();
      if (promise && promise.catch) promise.catch(() => {
        if (request !== attempt) return;
        wantsPlayback = false; syncPlayback();
      });
    } catch (_) { wantsPlayback = false; syncPlayback(); }
  }
  function pause() { wantsPlayback = false; attempt += 1; video.pause(); syncPlayback(); }
  chapters.forEach((button, index) => {
    button.type = 'button';
    button.addEventListener('click', () => { video.dataset.ahvHeroInteracted = '1'; pendingChapter = index; selectChapter(index); play(); });
  });
  if (toggle) toggle.addEventListener('click', () => { video.dataset.ahvHeroInteracted = '1'; video.paused ? play() : pause(); });
  video.addEventListener('loadedmetadata', seekPendingChapter);
  video.addEventListener('timeupdate', syncChapter); video.addEventListener('seeked', syncChapter);
  ['play', 'playing', 'pause', 'ended', 'error'].forEach(event => video.addEventListener(event, syncPlayback));
  win.document.addEventListener('visibilitychange', () => {
    if (win.document.hidden) video.pause(); else if (wantsPlayback) play();
  });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', event => { if (event.matches) pause(); });
  selectChapter(0); syncPlayback();
  // Respect reduced motion; autoplay refusal leaves an honest, usable Play button.
  if (!reducedMotion.matches && !(win.navigator && win.navigator.connection && win.navigator.connection.saveData)) {
    const start = () => { if (!win.document.hidden && !video.dataset.ahvHeroInteracted) play(); };
    const idle = () => win.requestIdleCallback ? win.requestIdleCallback(start, { timeout: 3000 }) : win.setTimeout(start, 1500);
    if (win.document.readyState === 'complete') idle(); else win.addEventListener('load', idle, { once: true });
  }
}
