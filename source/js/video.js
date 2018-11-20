$(document).ready(function() {
	$('.video-play-button').click(function() {
		var video = document.getElementById($(this).attr('data-target'));
		video.play();
		video.setAttribute('controls', 'controls');
		$(this).hide();
	});
});
