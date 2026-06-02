(() => {
  // Single character cursor-follow (always visible) + optional dblclick.
  // Note: uses inline SVG background fallback so it never disappears.

  const wrap = document.querySelector('.mascot-wrap');
  const img = document.querySelector('.mascot-img');
  const mascotEl = document.querySelector('.mascot');
  if (!wrap || !img || !mascotEl) return;

  let stateIndex = 0;
  let targetX = 0;
  let targetY = 0;
  let currentRX = 0;
  let currentRY = 0;
  let rafId = null;

  function ensureInlineSvg() {
    // Always show something (no external images required)
    if (!img.getAttribute('src') || img.getAttribute('src') === 'asset/char1.png' || img.getAttribute('src') === '') {
      img.style.display = 'block';
      // Inline SVG as data URL
      const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0' stop-color='#00E5FF' stop-opacity='0.35'/>
              <stop offset='1' stop-color='#8B5CF6' stop-opacity='0.35'/>
            </linearGradient>
          </defs>
          <rect x='10' y='10' width='180' height='180' rx='24' fill='url(#g)' stroke='rgba(255,255,255,0.18)'/>
          <path d='M65 85c10-18 60-18 70 0' fill='none' stroke='rgba(234,246,255,0.65)' stroke-width='6' stroke-linecap='round'/>
          <circle cx='78' cy='110' r='12' fill='rgba(234,246,255,0.75)'/>
          <circle cx='122' cy='110' r='12' fill='rgba(234,246,255,0.75)'/>
          <circle cx='82' cy='106' r='4' fill='#071020'/>
          <circle cx='126' cy='106' r='4' fill='#071020'/>
          <path d='M80 140c18 14 22 14 40 0' fill='none' stroke='rgba(234,246,255,0.7)' stroke-width='7' stroke-linecap='round'/>
          <text x='100' y='175' text-anchor='middle' font-family='Inter, Arial' font-size='14' fill='rgba(234,246,255,0.85)'>Naruto</text>
        </svg>`;

      img.setAttribute('src', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
      img.setAttribute('alt', 'Naruto mascot');
    }
  }

  function updateLoop() {
    rafId = null;

    // Smooth interpolation
    currentRX += (targetX - currentRX) * 0.14;
    currentRY += (targetY - currentRY) * 0.14;

    // Cursor -> tilt mapping
    const tiltX = currentRX; // rotateX
    const tiltY = currentRY; // rotateY

    mascotEl.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
  }

  function onMouseMove(e) {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // [-max..max] degrees
    const max = 12;
    targetX = Math.max(-max, Math.min(max, (-dy / rect.height) * max));
    targetY = Math.max(-max, Math.min(max, (dx / rect.width) * max));

    if (rafId == null) rafId = requestAnimationFrame(updateLoop);
  }

  function resetTilt() {
    targetX = 0;
    targetY = 0;
    if (rafId == null) rafId = requestAnimationFrame(updateLoop);
  }

  // Optional dblclick: tiny punch animation (no swapping)
  wrap.addEventListener('dblclick', (e) => {
    e.preventDefault();
    stateIndex++;
    img.animate([{ transform: 'scale(1.0)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1.0)' }], {
      duration: 220,
      easing: 'ease-out'
    });
  });

  // init
  ensureInlineSvg();
  resetTilt();

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseleave', resetTilt);
})();

