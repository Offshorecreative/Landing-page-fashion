const menu = document.querySelector('#nav');
const burger = document.querySelector('#burger');
function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.onclick = () => setMenu(!menu.classList.contains('open'));
menu.onclick = () => setMenu(false);
const viewer = document.querySelector('#viewer');
const media = document.querySelector('#media');
const photoNav = document.querySelector('#photoNav');
const photos = [...document.querySelectorAll('[data-photo] img')];
let current = 0;
function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  const image = new Image();
  image.src = photos[current].src;
  image.alt = photos[current].alt;
  media.replaceChildren(image);
  photoNav.querySelector('span').textContent = (current + 1) + ' / ' + photos.length;
}
photos.forEach((photo, index) => photo.parentElement.onclick = () => {
  photoNav.hidden = false;
  showPhoto(index);
  viewer.showModal();
});
photoNav.firstElementChild.onclick = () => showPhoto(current - 1);
photoNav.lastElementChild.onclick = () => showPhoto(current + 1);
viewer.onkeydown = event => {
  if (!photoNav.hidden && ['ArrowLeft','ArrowRight'].includes(event.key)) {
    event.preventDefault();
    showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
};
const visiblePreviews = new Set();
function updatePreview(preview) {
  if (!visiblePreviews.has(preview) || document.hidden || viewer.open) {
    preview.pause();
    return;
  }
  if (!preview.hasAttribute('src')) preview.src = preview.parentElement.dataset.video;
  preview.muted = true;
  preview.play().catch(() => {});
}
const previewObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.15) visiblePreviews.add(entry.target);
    else visiblePreviews.delete(entry.target);
    updatePreview(entry.target);
  }
}, { threshold: [0, 0.15] });
document.querySelectorAll('[data-video] video').forEach(preview => previewObserver.observe(preview));
function updateVisiblePreviews() {
  visiblePreviews.forEach(updatePreview);
}
document.addEventListener('visibilitychange', updateVisiblePreviews);
new MutationObserver(updateVisiblePreviews).observe(viewer, { attributes: true, attributeFilter: ['open'] });
document.querySelectorAll('[data-video]').forEach(card => card.onclick = () => {
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.poster = card.querySelector('video').poster;
  video.src = card.dataset.video;
  photoNav.hidden = true;
  media.replaceChildren(video);
  viewer.showModal();
  video.play().catch(() => {});
});
document.querySelector('#dismiss').onclick = () => viewer.close();
viewer.onclick = event => { if (event.target === viewer) viewer.close(); };
viewer.onclose = () => media.replaceChildren();
document.querySelector('#inquiry').onsubmit = event => {
  event.preventDefault();
  const fields = [...new FormData(event.target)].filter(([,value]) => value.trim());
  const message = ['Hi Offshore Creative! I’d like to discuss a fashion shoot.', ...fields.map(([key,value]) => key + ': ' + value)].join('\n\n');
  window.location.href = 'https://wa.me/628113935959?text=' + encodeURIComponent(message);
};
