(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const ALLOWED_PAGES = {
		NONE: '',
		TEASER: 'teaser',
		RESUME: 'resume'
	};

	//********************************************
	// SELECTORS
	//********************************************
	const _menuSwitches = Array.from(document.querySelectorAll('[data-menu-switch]'));
	const _pageAnchors = Array.from(document.querySelectorAll('[data-target]'));
	const _projectSwitches = Array.from(document.querySelectorAll('[data-project]'));
	const _resumeSwitches = Array.from(document.querySelectorAll('[data-resume-switch]'));
	const _master = document.body;

	//********************************************
	// INITIALIZE
	//********************************************
	init();

	///////////////////////////////////////////////////////////////////////

	//********************************************
	// FUNCTIONS
	//********************************************
	function init() {
		_menuSwitches.forEach((menuSwitch) => {
			menuSwitch.addEventListener('click', (e) => {
				e.preventDefault();

				if (_master.dataset.active === ALLOWED_PAGES.TEASER) {
					return closeMenu();
				}
				return openMenu();
			});
		});

		_resumeSwitches.forEach((resumeSwitch) => {
			resumeSwitch.addEventListener('click', (e) => {
				e.preventDefault();

				if(_master.dataset.active === ALLOWED_PAGES.RESUME){
					return closeResume();
				}
				return openResume();
			});
		});

		_pageAnchors.forEach((pageAnchor) => {

		});

		_projectSwitches.forEach((projectSwitch) => {

		});
	}

	function closeMenu() {
		_master.dataset.active = ALLOWED_PAGES.NONE;
	}

	function openMenu() {
		_master.dataset.active = ALLOWED_PAGES.TEASER;
	}

	function closeResume() {
		_master.dataset.active = ALLOWED_PAGES.NONE;
	}

	function openResume() {
		_master.dataset.active = ALLOWED_PAGES.RESUME;
	}
}());