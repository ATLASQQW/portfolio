'use strict';
const projects = {
  eatmarket: { title: 'EatMarket', category: 'AFTER EFFECTS / MOTION', description: 'Рекламный баннер для EatMarket.', type: 'video', file: 'assets/eatmarket.mp4', poster: 'assets/eatmarket-poster.webp' },
  bauhaus: { title: 'Баухаус', category: 'AFTER EFFECTS / MOTION', description: 'Анимированная афиша лекции о Баухаусе.', type: 'video', file: 'assets/bauhaus.mp4', poster: 'assets/bauhaus-poster.webp' },
  cyber: { title: 'Cyber Weeks', category: 'AFTER EFFECTS / MOTION', description: 'Анимационный баннер в неоновой стилистике.', type: 'video', file: 'assets/cyber.mp4', poster: 'assets/cyber-poster.webp' },
  kmikg: { title: 'КМиКГ', category: 'AFTER EFFECTS / MOTION', description: 'Презентационный ролик об учебных направлениях.', type: 'video', file: 'assets/kmikg.mp4', poster: 'assets/kmikg-poster.webp' },
  mine: { title: 'Шахта', category: 'BLENDER / 3D-СЦЕНА', description: 'Стилизованная сцена в low-poly эстетике.', type: 'image', file: 'assets/mine.webp', alt: '3D-рендер низкополигональной шахты с деревянными опорами и золотом' },
  grenade: { title: 'Граната', category: 'BLENDER / 3D-ОБЪЕКТ', description: 'Игровая стилизация и яркие материалы.', type: 'image', file: 'assets/grenade.webp', alt: '3D-рендер стилизованной гранаты на фиолетовом фоне' },
  donut: { title: 'Пончик и кофе', category: 'BLENDER / 3D-АНИМАЦИЯ', description: 'Предметная сцена в движении.', type: 'video', file: 'assets/donut.mp4', poster: 'assets/donut-poster.webp' },
  sea: { title: 'Море', category: 'BLENDER / 3D-АНИМАЦИЯ', description: 'Реалистичная 3D-графика.', type: 'video', file: 'assets/sea.mp4', poster: 'assets/sea-poster.webp' }
};
const dialog = document.getElementById('media-dialog');
const content = document.getElementById('dialog-content');
let lastTrigger = null;

function openProject(project, trigger) {
  if (typeof dialog.showModal !== 'function') return false;
  lastTrigger = trigger;
  document.getElementById('dialog-title').textContent = project.title;
  document.getElementById('dialog-category').textContent = project.category;
  document.getElementById('dialog-description').textContent = project.description;
  document.getElementById('dialog-file').href = project.file;
  const media = document.createElement(project.type === 'video' ? 'video' : 'img');
  media.src = project.file;
  if (project.type === 'video') {
    media.controls = true;
    media.playsInline = true;
    media.preload = 'metadata';
    media.poster = project.poster;
    media.setAttribute('aria-label', project.title);
    media.addEventListener('error', () => {
      const error = document.createElement('p');
      error.className = 'video-error';
      error.textContent = 'Не удалось загрузить видео. Попробуй открыть файл по ссылке ниже.';
      content.append(error);
    }, { once: true });
  } else {
    media.alt = project.alt;
  }
  content.replaceChildren(media);
  dialog.showModal();
  document.body.classList.add('modal-open');
  if (project.type === 'video') media.play().catch(() => {});
  return true;
}

document.querySelectorAll('[data-open]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const project = projects[link.dataset.open];
    if (project && openProject(project, link)) event.preventDefault();
  });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  const video = content.querySelector('video');
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  content.replaceChildren();
  document.body.classList.remove('modal-open');
  if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
});
