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
			y: touch.screenY,
			indentifier: touch.identifier
		};
	}

	function onContainerTouchMove(e) {
		let touch;

		for(let t of e.touches){
			if(t.identifier === touchStartPosition.indentifier){
				touch = t;
				break;
			}
		}

		if(!touch){
			return onContainerTouchEnd();
		}

		let currTouch = {
			x: touch.screenX,
			y: touch.screenY
		};

		if(lastTouchPosition && touchMoveVector) {
			let lastMoveVector = {
				x: currTouch.x - lastTouchPosition.x,
				y: currTouch.y - lastTouchPosition.y
			};

			let lastMoveAngle = Math.atan2(lastMoveVector.y, lastMoveVector.x);
			let touchMoveAngle = Math.atan2(lastMoveVector.y - touchMoveVector.y, lastMoveVector.x - touchMoveVector.x);

			let lastMoveDirection = Math.abs(lastMoveAngle) <= Math.PI / 2;
			let touchMoveDirection = Math.abs(touchMoveAngle) <= Math.PI / 2;

			if(Math.abs(touchMoveAngle) * 180 / Math.PI >= 145){
				e.preventDefault();
			}

			console.log(touchMoveAngle * 180 / Math.PI);
		}

		lastTouchPosition = currTouch;

		touchMoveVector = {
			x: lastTouchPosition.x - touchStartPosition.x,
			y: lastTouchPosition.y - touchStartPosition.y
		};
	}

	function onContainerTouchEnd(e) {
		console.log("Touch ended");
	}
}());