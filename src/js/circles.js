(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const CIRCLE_BACKGROUND_STROKE = '#eaeaea';
	const CIRCLE_FOREGROUND_STROKE = '#2c2c2c';
	const CIRCLE_STROKE_WIDTH = 15;

	//********************************************
	// SELECTORS
	//********************************************
	const _circles = Array.from(document.querySelectorAll('#languages .lang canvas'));

	//********************************************
	// REGISTER EVENTS
	//********************************************
	window.addEventListener('resize', onWindowResize);

	//********************************************
	// INITIALIZE
	//********************************************
	init();

	///////////////////////////////////////////////////////////////////////

	//********************************************
	// FUNCTIONS
	//********************************************
	function init() {
		// Redraw window-size-dependent elements
		onWindowResize();
	}

	function drawCanvasCircles() {
		_circles.forEach((circle) => {
			let ctx = circle.getContext('2d');
			let size = parseInt(window.getComputedStyle(circle).width);
			let value = parseInt(circle.dataset.value);
			let pixelRatio = window.devicePixelRatio;

			ctx.scale(pixelRatio, pixelRatio);

			circle.width = size;
			circle.height = size;

			ctx.lineWidth = CIRCLE_STROKE_WIDTH;

			ctx.beginPath();
			ctx.strokeStyle = CIRCLE_BACKGROUND_STROKE;
			ctx.arc(size / 2, size / 2, size / 2 - CIRCLE_STROKE_WIDTH, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = CIRCLE_FOREGROUND_STROKE;
			ctx.arc(size / 2, size / 2, size / 2 - CIRCLE_STROKE_WIDTH, -Math.PI / 2, 2 * Math.PI / 100 * value - Math.PI / 2);
			ctx.stroke();
		});
	}

	//********************************************
	// EVENT HANDLER
	//********************************************
	function onWindowResize() {
		drawCanvasCircles();
	}
}());