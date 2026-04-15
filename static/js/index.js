window.HELP_IMPROVE_VIDEOJS = false;

function syncFig2CardHeight() {
  const figureCard = document.querySelector('#fig2 .fig2-figure-card');
  const figureImage = document.querySelector('#fig2 .fig2-figure-card img');
  const referenceCard = document.querySelector('#fig2 .fig2-reference-card');

  if (!figureCard || !figureImage || !referenceCard) return;

  figureCard.style.height = '';
  figureImage.style.height = '';

  if (window.innerWidth <= 768) return;

  const targetHeight = Math.round(referenceCard.getBoundingClientRect().height);
  const label = figureCard.querySelector('.video-label');
  const labelHeight = label ? Math.round(label.getBoundingClientRect().height) : 0;

  if (targetHeight > 0) {
    figureCard.style.height = `${targetHeight}px`;
    figureImage.style.height = `${Math.max(targetHeight - labelHeight, 0)}px`;
  }
}

function syncVideoGroups() {
  const groups = new Map();
  document.querySelectorAll('video[data-sync-group]').forEach((video) => {
    const groupName = video.dataset.syncGroup;
    if (!groups.has(groupName)) groups.set(groupName, []);
    groups.get(groupName).push(video);
  });

  groups.forEach((videos) => {
    if (videos.length < 2) return;
    videos.forEach((video) => {
      video.muted = true;
      video.loop = true;
      video.preload = 'auto';
      video.playbackRate = 0.75;
    });

    const waitUntilReady = (video) => new Promise((resolve) => {
      if (video.readyState >= 3) {
        resolve();
        return;
      }
      video.addEventListener('canplay', resolve, { once: true });
    });

    Promise.all(videos.map(waitUntilReady)).then(() => {
      videos.forEach((video) => {
        video.currentTime = 0;
        video.playbackRate = 0.75;
      });
      videos.forEach((video) => video.play().catch(() => {}));
    });
  });
}

$(document).ready(function() {
  $('.navbar-burger').click(function() {
    $('.navbar-burger').toggleClass('is-active');
    $('.navbar-menu').toggleClass('is-active');
  });

  if (typeof bulmaCarousel !== 'undefined') {
    bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false
    });
  }

  if (typeof bulmaSlider !== 'undefined') {
    bulmaSlider.attach();
  }

  syncVideoGroups();
  syncFig2CardHeight();
  $(window).on('load resize', syncFig2CardHeight);
  $('video[data-sync-group="fig2"]').on('loadedmetadata loadeddata canplay', syncFig2CardHeight);

  $('.arch-tab').click(function() {
    const panelId = $(this).data('panel');
    $('.arch-tab').parent().removeClass('is-active');
    $(this).parent().addClass('is-active');
    $('.arch-panel').removeClass('is-active');
    $('#' + panelId).addClass('is-active');
    syncVideoGroups();
  });
});
