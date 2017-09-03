(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const PROJECT_ACTIVE_CLASS = 'active';

	//********************************************
	// VARIABLES
	//********************************************
	let touchMoveVector;
	let touchStartPosition;
	let lastTouchPosition;
	let activeProjectIndex;

	//********************************************
	// SELECTORS
	//********************************************
	const _projectPreviews = Array.from(document.querySelectorAll('#projects .project'));
	const _projectPreviewContainer = document.querySelector('#projects .project-slider');

	//********************************************
	// REGISTER EVENTS
	//********************************************
	_projectPreviewContainer.addEventListener('touchstart', onContainerTouchStart);
	_projectPreviewContainer.addEventListener('touchmove', onContainerTouchMove);
	_projectPreviewContainer.addEventListener('touchend', onContainerTouchEnd);
	_projectPreviewContainer.addEventListener('touchcancel', onContainerTouchEnd);

	//********************************************
	// INITIALIZE
	//********************************************
	init();

	///////////////////////////////////////////////////////////////////////

	//********************************************
	// FUNCTIONS
	//********************************************
	function init() {
		// Bind events to projects
		_projectPreviews.forEach((project, index) => {
			project.addEventListener('click', (e) => {
				if (project.classList.contains(PROJECT_ACTIVE_CLASS)) {
					return;
				}

				requestAnimationFrame(() => {
					for (let sibling of _projectPreviews) {
						sibling.classList.remove(PROJECT_ACTIVE_CLASS);
					}

					_projectPreviewContainer.style.transform = `translateX(-${index * 100}%)`;
					project.classList.add(PROJECT_ACTIVE_CLASS);
				});
			});
		});
	}

	//********************************************
	// EVENT HANDLER
	//********************************************
	function onContainerTouchStart(e){
		if(e.touches.length > 1){
			return;
		}

		let touch = e.touches[0];

		touchStartPosition = {
			x: touch.screenX,
			y: touch.screenY
		};
	}

	function onContainerTouchMove(e) {
		e.preventDefault();

		let touch = e.touches[0];

		lastTouchPosition = {
			x: touch.screenX,
			y: touch.screenY
		};
	}

	function onContainerTouchEnd(e) {

	}
}());