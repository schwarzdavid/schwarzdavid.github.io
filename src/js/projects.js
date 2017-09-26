(function () {
	'use strict';

	// TODO: Add documentation to variables
	// TODO: Add documentation to constants
	// TODO: Add documentation to functions-

	//********************************************
	// CONSTANTS
	//********************************************
	const PROJECT_ACTIVE_CLASS = 'active';
	const MIN_DRAG_DISTANCE = 0.25;
	const UNSET_ACTIVE_TIME = 150;
	const INTERVAL_TIME = 5000;

	//********************************************
	// VARIABLES
	//********************************************
	let firstTouchPosition;
	let firstInteractionPosition;
	let lastInteractionPosition;
	let activeProjectIndex = 0;
	let unsetActiveTimeout;
	let preventNextClick;
	let projectCarousel;
	let bodyObserver;
	let projectsVisible = true;

	//********************************************
	// SELECTORS
	//********************************************
	const _projectPreviews = Array.from(document.querySelectorAll('#projects .project'));
	const _projectSection = document.querySelector('#projects');
	const _projectPreviewContainer = document.querySelector('#projects .project-slider');
	const _projectProgress = document.querySelector('#projects .project-wrapper progress');

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
				if(preventNextClick){
					preventNextClick = false;
					return;
				}

				if (project.classList.contains(PROJECT_ACTIVE_CLASS)) {
					console.log("open project");
				} else {
					activeProjectIndex = index;
					setActiveProject(activeProjectIndex);
				}
			});
		});

		if('IntersectionObserver' in window){
			bodyObserver = new IntersectionObserver(observerCallback);
			bodyObserver.observe(_projectSection);
		}

		projectCarousel = setInterval(nextProject, INTERVAL_TIME);
	}

	function observerCallback(entry) {
		if(entry.length > 1){
			throw new Error('too many entries on observer');
		}
		projectsVisible = entry[0].isIntersecting;
	}

	function setActiveProject(index) {
		requestAnimationFrame(() => {
			_projectPreviewContainer.classList.remove('notransition');

			for (let sibling of _projectPreviews) {
				sibling.classList.remove(PROJECT_ACTIVE_CLASS);
			}

			_projectPreviewContainer.style.transform = `translateX(${index * -100}%)`;
			_projectPreviews[index].classList.add(PROJECT_ACTIVE_CLASS);
			_projectProgress.value = index +1;
		});
	}

	function nextProject() {
		if(projectsVisible) {
			if (activeProjectIndex < _projectPreviews.length - 1) {
				activeProjectIndex++;
			} else {
				activeProjectIndex = 0;
			}

			setActiveProject(activeProjectIndex);
		}
	}

	function containerInteractionStart(x, y) {
		// Save start position
		firstInteractionPosition = {
			x: x,
			y: y
		};

		// Clear project rotation
		clearInterval(projectCarousel);
		projectCarousel = null;

		// Pause animations when dragging project
		requestAnimationFrame(() => {
			_projectPreviewContainer.classList.add('notransition')
		});

		// Remove active class from project
		if (!unsetActiveTimeout) {
			unsetActiveTimeout = setTimeout(() => {
				requestAnimationFrame(() => {
					for (let prev of _projectPreviews) {
						prev.classList.remove(PROJECT_ACTIVE_CLASS);
					}
					preventNextClick = true;
				});
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

		requestAnimationFrame(() => {
			_projectPreviewContainer.style.transform = `translateX(${totalOffset}%)`;
		});

		lastInteractionPosition = {
			x: x,
			y: y
		};
	}

	function containerInteractionEnd() {
		if(firstInteractionPosition && lastInteractionPosition) {
			let xDist = firstInteractionPosition.x - lastInteractionPosition.x;
			let projectWidth = parseInt(window.getComputedStyle(_projectPreviewContainer).width);
			let percentOffset = xDist / projectWidth;

			if (percentOffset < -MIN_DRAG_DISTANCE && activeProjectIndex > 0) {
				activeProjectIndex--;
			}

			if (percentOffset > MIN_DRAG_DISTANCE && activeProjectIndex < _projectPreviews.length - 1) {
				activeProjectIndex++;
			}
		}

		setActiveProject(activeProjectIndex);
		clearTimeout(unsetActiveTimeout);
		firstInteractionPosition = null;
		lastInteractionPosition = null;
		unsetActiveTimeout = null;

		projectCarousel = setInterval(nextProject, INTERVAL_TIME);
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
			identifier: e.touches[0].identifier
		};

		containerInteractionStart(firstTouchPosition.x, firstTouchPosition.y);
	}

	function onContainerTouchMove(e) {
		// Return if no touch position was found
		if (!firstTouchPosition) {
			return;
		}

		// Identify touch
		let touch;
		for (let t of e.touches) {
			if (t.identifier === firstTouchPosition.identifier) {
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

		if ((touchMoveAngle < Math.PI / 4 || touchMoveAngle > Math.PI / 4 * 3) && e.cancelable) {
			e.preventDefault();
			containerInteractionMove(touch.x, touch.y);
		} else {
			onContainerTouchEnd();
		}
	}

	function onContainerTouchEnd() {
		if(!firstTouchPosition){
			return;
		}

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