window.HELP_IMPROVE_VIDEOJS = false;

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

  $('.arch-tab').click(function() {
    const panelId = $(this).data('panel');
    $('.arch-tab').parent().removeClass('is-active');
    $(this).parent().addClass('is-active');
    $('.arch-panel').removeClass('is-active');
    $('#' + panelId).addClass('is-active');
    syncVideoGroups();
  });
});
