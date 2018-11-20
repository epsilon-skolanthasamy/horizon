$(document).ready(function () {
  // Handle hero/banner behavior
  if (! Modernizr.objectfit) {
    $('.hero-banner-image').each(function () {
      var $container = $(this),
        imgUrl = $container.find('img').prop('src');

      if (imgUrl) {
        $container.css('backgroundImage', 'url(' + imgUrl + ')')
          .addClass('banner-object-fit');
      }
    });
  }

  // Progress bar selected element label display
  $('.progress-indicator li.completed').last().addClass('completed-last');

  // Click handler for progress bar elemnts
  $(document).on('click', '.progress-indicator li', function() {
    $('.progress-indicator li').removeClass('completed completed-last');
    $(this).addClass('completed completed-last').prevAll().addClass('completed');

    // TODO: Update compare plans display here
  });

  // Mouse over handler for progress bar elemnts
  $('.progress-indicator li .bubble').mouseenter(function () {
    $(this).parent('li').addClass('bubble-hover');
  });
  $('.progress-indicator li .bubble').mouseleave(function () {
    $(this).parent('li').removeClass('bubble-hover');
  });
});
