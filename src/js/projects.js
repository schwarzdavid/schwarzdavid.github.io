(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const PROJECT_ACTIVE_CLASS = 'active';

	//********************************************
	// VARIABLES
	//********************************************
	let firstTouchPosition;
	let firstInteractionPosition;
	let lastInteractionPosition;
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
	_projectPreviewContainer.addEventListener('mousedown', onContainerMouseDown);
	_projectPreviewContainer.addEventListener('mousemove', onContainerMouseMove);
	_projectPreviewContainer.addEventListener('mouseup', onContainerMouseUp);

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

	function containerInteractionStart(x, y) {
		firstInteractionPosition = {
			x: x,
			y: y
		};
	}

	function containerInteractionMove(x, y) {
		

		lastInteractionPosition = {
			x: x,
			y: y
		};
	}

	function containerInteractionEnd() {

	}

	//********************************************
	// EVENT HANDLER
	//********************************************
	function onContainerTouchStart(e) {
		if (e.touches.length > 1) {
			return;
		}

		firstTouchPosition = {
			x: e.touches[0].screenX,
			y: e.touches[0].screenY,
			indentifier: e.touches[0].identifier
		};

		containerInteractionStart(firstTouchPosition.x, firstTouchPosition.y);
	}

	function onContainerTouchMove(e) {
		let touch;

		for (let t of e.touches) {
			if (t.identifier === firstTouchPosition.indentifier) {
				touch = {
					x: t.screenX,
					y: t.screenY
				};
				break;
			}
		}

		if (!touch) {
			return onContainerTouchEnd();
		}

		if (lastInteractionPosition) {
			let touchMoveVector = {
				x: touch.x - firstTouchPosition.x,
				y: touch.y - firstTouchPosition.y
			};

			let touchMoveAngle = Math.abs(Math.atan2(touchMoveVector.y, touchMoveVector.x));

			if ((touchMoveAngle < Math.PI / 4 || (Math.PI + touchMoveAngle) > Math.PI / 4 * 3) || e.cancelable) {
				return e.preventDefault();
			}
		}

		return containerInteractionMove(touch.x, touch.y);
	}

	function onContainerTouchEnd() {
		containerInteractionEnd();
	}

	function onContainerMouseDown(e) {
		containerInteractionStart(e.clientX, e.clientY);
	}

	function onContainerMouseMove(e) {
		containerInteractionMove(e.clientX, e.clientY);
	}

	function onContainerMouseUp(e) {
		containerInteractionEnd();
	}
}());