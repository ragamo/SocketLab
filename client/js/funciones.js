$(document).ready(function() {
	
	document.ontouchstart = function(evt) {
		var coords = {x: evt.pageX, y: evt.pageY};
		$('.player').animate({
			top: coords.y+'px',
			left: coords.x+'px'
		});
	}
	
});
