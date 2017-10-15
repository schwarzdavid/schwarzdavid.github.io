(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const ALLOWED_PAGES = {
		HOME: 'home',
		TEASER: 'teaser',
		RESUME: 'resume'
	};

	//********************************************
	// SELECTORS
	//********************************************
	const _links = Array.from(document.querySelectorAll('[data-link]'));
	const _switches = Array.from(document.querySelectorAll('[data-switch]'));
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
		_switches.forEach((_switch) => {
			_switch.addEventListener('click', (e) => {
				e.preventDefault();

				const targetOptions = _switch.dataset.switch.split('-');
				const currOpen = _master.dataset.active;
				let target = targetOptions[0];

				if(currOpen === targetOptions[0].toString().toLowerCase()){
					target = targetOptions[1];
				}

				const page = getPage(target);
				if(!page){
					throw new Error(`Illegal page: ${target}`);
				}

				return openPage(page);
			});
		});

		_links.forEach((_link) => {
			_link.addEventListener('click', (e) => {
				e.preventDefault();

				const target = _link.dataset.link;
				const page = getPage(target);
				if(!page){
					throw new Error(`Illegal page: ${target}`);
				}

				return openPage(page);
			});
		});
	}

	function getPage(target) {
		const lowerTarget = target.toString().toLowerCase();
		let result = '';
		for(let p in ALLOWED_PAGES){
			if(ALLOWED_PAGES[p] === lowerTarget){
				result = p;
			}
		}
		return result;
	}

	function openPage(page) {
		requestAnimationFrame(() => {
			_master.dataset.active = ALLOWED_PAGES[page];
		});
	}
}());