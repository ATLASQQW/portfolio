'use strict';

(() => {
  const player = document.getElementById('holiday-video');
  const options = Array.from(document.querySelectorAll('[data-holiday]'));
  if (!player || !options.length) return;

  const title = document.getElementById('holiday-current-title');
  const index = document.getElementById('holiday-index');
  const announcement = document.getElementById('holiday-announcement');
  const error = document.getElementById('holiday-error');
  const fileLink = document.getElementById('holiday-file-link');
  let selected = options.find(option => option.getAttribute('aria-current') === 'true') || options[0];

  function selectHoliday(option) {
    if (option !== selected) {
      player.pause();
      const label = option.querySelector('.holiday-option-title').textContent.trim();
      const position = options.indexOf(option) + 1;
      player.poster = option.querySelector('img').getAttribute('src');
      player.src = option.getAttribute('href');
      player.setAttribute('aria-label', `Анимированное поздравление: ${label}`);
      title.textContent = label;
      index.textContent = `${String(position).padStart(2, '0')} / ${String(options.length).padStart(2, '0')}`;
      fileLink.href = option.getAttribute('href');
      error.hidden = true;
      options.forEach(link => {
        const active = link === option;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      selected = option;
      announcement.textContent = `Выбрано поздравление «${label}», ${position} из ${options.length}.`;
      player.load();
    }
    player.play().catch(() => {});
  }

  options.forEach(option => {
    option.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      selectHoliday(option);
    });
  });

  player.addEventListener('error', () => { error.hidden = false; });
  player.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(video => { if (video !== player) video.pause(); });
  });
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('[data-open]')) player.pause();
  }, true);
})();
