(function () {
	'use strict';

	// TODO: learn proper english and update comments then

	//********************************************
	// CONSTANTS
	//********************************************
	const INTERVAL_TIME = 5000;                     // Preview carousel interval
	const MIN_DRAG_DISTANCE = 0.25;                 // Factor of preview width, that the user has to swipe
	const PROJECT_ACTIVE_CLASS = 'active';          // Classname for currently visible project preview
	const UNSET_ACTIVE_TIME = 150;                  // Duration how long the preview has to be pressed until the zoom effect will be disabled

	//********************************************
	// VARIABLES
	//********************************************
	let activeProjectIndex = 0;                     // Determinates the currently visible preview
	let bodyObserver;                               // Contains intersection observer to check, if projects are visible or not
	let firstInteractionPosition;                   // Contains the position of the last interaction start position (mouse or touch)
	let firstTouchPosition;                         // Contains the position of the last touch start position
	let lastInteractionPosition;                    // Contains the position of the last interaction move position (mouse or touch)
	let preventNextClick;                           // Next click-event should be aborted, because touchend event cannot prevent click event
	let projectCarousel;                            // Contains the interval object of the preview carousel
	let projectsVisible = true;                     // Contains information, if projects are visible or not
	let unsetActiveTimeout;                         // Contains timeout which will be created when a interaction start begins. When finished, it will remove the active-class from all project previews

	//********************************************
	// SELECTORS
	//********************************************
	const _projectPreviewContainer = document.querySelector('#projects .project-slider');
	const _projectPreviews = Array.from(document.querySelectorAll('#projects .project'));
	const _projectProgress = document.querySelector('#projects .project-wrapper progress');
	const _projectSection = document.querySelector('#projects');

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
	/**
	 * Should be run once, when the page is loaded.
	 * Dynamically binds click-event to all project previews, initializes the intersection observer and starts
	 * the project carousel
	 */
	function init() {
		// Bind events to projects
		_projectPreviews.forEach((project, index) => {
			project.addEventListener('click', (e) => {
				if (preventNextClick) {
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

		if ('IntersectionObserver' in window) {
			bodyObserver = new IntersectionObserver(observerCallback);
			bodyObserver.observe(_projectSection);
		}

		projectCarousel = setInterval(nextProject, INTERVAL_TIME);
	}

	/**
	 * Should be executed whenever the observer detects a change.
	 * Determinates, if the project container is visible and saves the result to projectsVisible variable
	 * @param entry
	 */
	function observerCallback(entry) {
		if (entry.length > 1) {
			throw new Error('too many entries on observer');
		}
		projectsVisible = entry[0].isIntersecting;
	}

	/**
	 * Sets focus to the project preview on given index
	 * @param {int} [index=activeProjectIndex] - Index of project preview, which should be focused
	 */
	function setActiveProject(index = activeProjectIndex) {
		requestAnimationFrame(() => {
			_projectPreviewContainer.classList.remove('notransition');

			for (let sibling of _projectPreviews) {
				sibling.classList.remove(PROJECT_ACTIVE_CLASS);
			}

			_projectPreviewContainer.style.transform = `translateX(${index * -100}%)`;
			_projectPreviews[index].classList.add(PROJECT_ACTIVE_CLASS);
			_projectProgress.value = index + 1;
		});
	}

	/**
	 * Makes a next step in the project carousel. When the end is reached, the index will be set to 0
	 */
	function nextProject() {
		if (projectsVisible) {
			if (activeProjectIndex < _projectPreviews.length - 1) {
				activeProjectIndex++;
			} else {
				activeProjectIndex = 0;
			}

			setActiveProject();
		}
	}

	/**
	 * Prepares further move-interactions with projectpreviews.
	 * Should be called whenever an interaction starts (touch or mouse)
	 * @param {number} x - X-Position of interaction start
	 * @param {number} y - Y-Position of interaction start
	 */
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

	/**
	 * Calculates percentual move offset and moves project previews to calculated offset.
	 * Should be called on every interaction move
	 * @param {number} x - X-Position of interaction move
	 * @param {number} y - Y-Position of interaction move
	 */
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

	/**
	 * Should be called whenever the interaction ends or the interaction should be aborted.
	 * Resets all values and sets focus to new project index
	 */
	function containerInteractionEnd() {
		if (firstInteractionPosition && lastInteractionPosition) {
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
	/**
	 * Gets called when a touch starts.
	 * If started touch is the first one, starts project interaction
	 * @param e Event
	 */
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

	/**
	 * Gets called when a touch move has been detected.
	 * If the touch angle is less than +- 45deg, the interaction move function gets called.
	 * @param e Event
	 */
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
			// Prevents native page-foward/-back interactions
			e.preventDefault();

			containerInteractionMove(touch.x, touch.y);
		} else {
			onContainerTouchEnd();
		}
	}

	/**
	 * Gets called when a touch ends.
	 * Resets all, by the touch used, variables and calls the interaction end function
	 */
	function onContainerTouchEnd() {
		if (!firstTouchPosition) {
			return;
		}

		firstTouchPosition = null;
		containerInteractionEnd();
	}

	/**
	 * Proxy function for interactionstart on mousedown
	 * @param e
	 */
	function onContainerMouseDown(e) {
		containerInteractionStart(e.screenX, e.screenY);
	}

	/**
	 * Proxy function for interactionmove on mousemove
	 * @param e
	 */
	function onContainerMouseMove(e) {
		containerInteractionMove(e.screenX, e.screenY);
	}

	/**
	 * Procy function for interactionend on mouseup
	 */
	function onContainerMouseUp() {
		containerInteractionEnd();
	}
}());
