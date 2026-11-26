
/* ==========================================
   MOBILE NAVIGATION
========================================== */

const menu = document.querySelector('#nav');
const burger = document.querySelector('#burger');

function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
}

burger.onclick = () => {
  setMenu(!menu.classList.contains('open'));
};

menu.onclick = () => setMenu(false);


/* ==========================================
   PORTFOLIO VIEWER
========================================== */

const viewer = document.querySelector('#viewer');
const media = document.querySelector('#media');
const photoNav = document.querySelector('#photoNav');

const soundToggle = document.querySelector('#soundToggle');
const dismiss = document.querySelector('#dismiss');

const viewerCategory = document.querySelector('#viewerCategory');
const viewerTitle = document.querySelector('#viewerTitle');
const viewerLink = document.querySelector('#viewerLink');

const photos = [
  ...document.querySelectorAll('[data-photo] img')
];

let current = 0;
let activeVideo = null;


/* PROJECT INFORMATION */

function setViewerInfo(category, title) {
  viewerCategory.textContent = category;
  viewerTitle.textContent = title;
}


/* ==========================================
   PHOTOGRAPHY VIEWER
========================================== */

function showPhoto(index) {

  current = (index + photos.length) % photos.length;

  const photo = photos[current];

  const image = new Image();

  image.src = photo.src;
  image.alt = photo.alt;

  media.replaceChildren(image);

  setViewerInfo(
    'PHOTOGRAPHY',
    photo.alt || 'Fashion photography'
  );

  photoNav.querySelector('span').textContent =
    (current + 1) + ' / ' + photos.length;
}


/* OPEN PHOTOGRAPHY */

photos.forEach((photo, index) => {

  photo.parentElement.onclick = () => {

    photoNav.hidden = false;
    soundToggle.hidden = true;

    showPhoto(index);

    viewer.showModal();

  };

});


/* PHOTO NAVIGATION */

photoNav.firstElementChild.onclick = () => {
  showPhoto(current - 1);
};

photoNav.lastElementChild.onclick = () => {
  showPhoto(current + 1);
};


/* KEYBOARD PHOTO NAVIGATION */

viewer.onkeydown = event => {

  if (
    !photoNav.hidden &&
    ['ArrowLeft', 'ArrowRight'].includes(event.key)
  ) {

    event.preventDefault();

    showPhoto(
      current + (event.key === 'ArrowRight' ? 1 : -1)
    );

  }

};


/* ==========================================
   VIDEO CARD PREVIEWS
========================================== */

const visiblePreviews = new Set();

function updatePreview(preview) {

  if (
    !visiblePreviews.has(preview) ||
    document.hidden ||
    viewer.open
  ) {

    preview.pause();
    return;

  }

  if (!preview.hasAttribute('src')) {

    preview.src = preview.parentElement.dataset.video;

  }

  preview.muted = true;

  preview.play().catch(() => {});

}


/* OBSERVE VISIBLE CARDS */

const previewObserver = new IntersectionObserver(entries => {

  for (const entry of entries) {

    if (
      entry.isIntersecting &&
      entry.intersectionRatio >= 0.15
    ) {

      visiblePreviews.add(entry.target);

    } else {

      visiblePreviews.delete(entry.target);

    }

    updatePreview(entry.target);

  }

}, {
  threshold: [0, 0.15]
});


/* REGISTER VIDEO PREVIEWS */

document.querySelectorAll('[data-video] video').forEach(preview => {

  previewObserver.observe(preview);

});


/* UPDATE PREVIEWS WHEN PAGE VISIBILITY CHANGES */

function updateVisiblePreviews() {

  visiblePreviews.forEach(updatePreview);

}

document.addEventListener(
  'visibilitychange',
  updateVisiblePreviews
);


/* PAUSE PREVIEWS WHEN POPUP OPENS */

new MutationObserver(updateVisiblePreviews).observe(viewer, {

  attributes: true,
  attributeFilter: ['open']

});


/* ==========================================
   VIDEO POPUP
========================================== */

document.querySelectorAll('[data-video]').forEach(card => {

  card.onclick = () => {

    /* Create video */

    const video = document.createElement('video');

    video.controls = true;
    video.playsInline = true;
    video.autoplay = true;
    video.muted = true;

    video.poster = card.querySelector('video').poster;

    video.src = card.dataset.video;

    activeVideo = video;


    /* Get project information */

    const category = card.querySelector('small').textContent;

    const title = card.querySelector('strong').textContent;

    setViewerInfo(
      category.toUpperCase(),
      title
    );


    /* Show video controls */

    photoNav.hidden = true;

    soundToggle.hidden = false;

    soundToggle.textContent = 'Sound on';


    /* Insert video */

    media.replaceChildren(video);


    /* Open popup */

    viewer.showModal();


    /* Play video */

    video.play().catch(() => {});

  };

});


/* ==========================================
   SOUND TOGGLE
========================================== */

soundToggle.onclick = () => {

  if (!activeVideo) return;

  activeVideo.muted = !activeVideo.muted;

  soundToggle.textContent = activeVideo.muted
    ? 'Sound on'
    : 'Sound off';

};


/* ==========================================
   CLOSE POPUP
========================================== */

dismiss.onclick = () => {

  viewer.close();

};


/* CLOSE WHEN CLICKING OUTSIDE CONTENT */

viewer.onclick = event => {

  if (event.target === viewer) {

    viewer.close();

  }

};


/* CLEAN UP WHEN POPUP CLOSES */

viewer.onclose = () => {

  if (activeVideo) {

    activeVideo.pause();

    activeVideo.removeAttribute('src');

    activeVideo.load();

  }

  activeVideo = null;

  media.replaceChildren();

  soundToggle.hidden = true;

  soundToggle.textContent = 'Sound on';

  photoNav.hidden = false;

};


/* PROJECT PORTFOLIO LINK */

viewerLink.onclick = () => {

  viewer.close();

};


/* ==========================================
   WHATSAPP CONTACT FORM
========================================== */

document.querySelector('#inquiry').onsubmit = event => {

  event.preventDefault();

  const fields = [
    ...new FormData(event.target)
  ].filter(([, value]) => value.trim());

  const message = [

    'Hi Offshore Creative! I’d like to discuss a fashion shoot.',

    ...fields.map(([key, value]) => key + ': ' + value)

  ].join('\n\n');

  window.location.href =
    'https://wa.me/628113935959?text=' +
    encodeURIComponent(message);

};
