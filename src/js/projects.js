(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const PROJECT_ACTIVE_CLASS = 'active';
	const MIN_DRAG_DISTANCE = 0.25;
	const UNSET_ACTIVE_TIME = 100;

	//********************************************
	// VARIABLES
	//********************************************
	let firstTouchPosition;
	let firstInteractionPosition;
	let lastInteractionPosition;
	let activeProjectIndex = 0;
	let unsetActiveTimeout;
	let preventNextClick;

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

				if(preventNextClick){
					preventNextClick = false;
					return;
				}

				activeProjectIndex = index;
				setActiveProject(activeProjectIndex);
			});
		});
	}

	function setActiveProject(index) {
		requestAnimationFrame(() => {
			_projectPreviewContainer.classList.remove('notransition');

			for (let sibling of _projectPreviews) {
				sibling.classList.remove(PROJECT_ACTIVE_CLASS);
			}

			_projectPreviewContainer.style.transform = `translateX(${index * -100}%)`;
			_projectPreviews[index].classList.add(PROJECT_ACTIVE_CLASS);
		});
	}

	function containerInteractionStart(x, y) {
		firstInteractionPosition = {
			x: x,
			y: y
		};

		requestAnimationFrame(() => {
			_projectPreviewContainer.classList.add('notransition')
		});

		if (!unsetActiveTimeout) {
			unsetActiveTimeout = setTimeout(() => {
				for (let prev of _projectPreviews) {
					prev.classList.remove(PROJECT_ACTIVE_CLASS);
				}
			}, UNSET_ACTIVE_TIME);
		}
	}

	function containerInteractionMove(x, y) {
		if (!firstInteractionPosition) {
			return;
		}

		let xDist = firstInteractionPosition.x - x;
		let projectWidth = parseInt(window.getComputedStyle(_projectPreviewContainer).width);
		let percentOffset = xDist / projectWidth;
		let totalOffset = ((activeProjectIndex) + percentOffset) * -100;

		_projectPreviewContainer.style.transform = `translateX(${totalOffset}%)`;

		lastInteractionPosition = {
			x: x,
			y: y
		};
	}

	function containerInteractionEnd() {
		let xDist = firstInteractionPosition.x - lastInteractionPosition.x;
		let projectWidth = parseInt(window.getComputedStyle(_projectPreviewContainer).width);
		let percentOffset = xDist / projectWidth;

		firstInteractionPosition = null;

		if (percentOffset < -MIN_DRAG_DISTANCE && activeProjectIndex > 0) {
			activeProjectIndex--;
		}

		if (percentOffset > MIN_DRAG_DISTANCE && activeProjectIndex < _projectPreviews.length - 1) {
			activeProjectIndex++;
		}

		setActiveProject(activeProjectIndex);
		clearTimeout(unsetActiveTimeout);
		unsetActiveTimeout = null;
		preventNextClick = true;
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
		// Return if no touch position was found
		if (firstTouchPosition) {
			return;
		}

		// Identify touch
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

		let touchMoveVector = {
			x: touch.x - firstTouchPosition.x,
			y: touch.y - firstTouchPosition.y
		};

		let touchMoveAngle = Math.abs(Math.atan2(touchMoveVector.y, touchMoveVector.x));

		if ((touchMoveAngle < Math.PI / 4 || (Math.PI - touchMoveAngle) > Math.PI / 4 * 3) && e.cancelable) {
			e.preventDefault();
			containerInteractionMove(touch.x, touch.y);
		} else {
			onContainerTouchEnd();
		}
	}

	function onContainerTouchEnd() {
		firstTouchPosition = null;
		containerInteractionEnd();
	}

	function onContainerMouseDown(e) {
		containerInteractionStart(e.screenX, e.screenY);
	}

	function onContainerMouseMove(e) {
		containerInteractionMove(e.screenX, e.screenY);
	}

	function onContainerMouseUp() {
		containerInteractionEnd();
	}
}());