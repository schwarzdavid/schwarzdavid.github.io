(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const PROJECT_ACTIVE_CLASS = 'active';

	//********************************************
	// SELECTORS
	//********************************************
	const _projectPreviews = Array.from(document.querySelectorAll('#projects .project'));
	const _projectPreviewContainer = document.querySelector('#projects .project-slider');

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
}());