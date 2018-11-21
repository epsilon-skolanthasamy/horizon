$(document).ready(function() {
	$('.video-play-button').click(function() {
		var video = document.getElementById($(this).attr('data-target'));
		video.play();
		video.setAttribute('controls', 'controls');
		$(this).hide();
	});


// Video Content
	$(".video-show-content").click(function(){
		$(".videobox-hidden-content").toggle();
		$(this).toggleClass("content-shown");
	});
});
