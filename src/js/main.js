(function (win) {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const COOKIE_ACCEPT_NAME = 'cookiesAccepted';
	const INVERT_ME_CLASS = 'invertMe';

	//********************************************
	// SELECTORS
	//********************************************
	const elCookieHint = document.querySelector('#cookies');
	const elMap = document.querySelector('#map');
	const elsSensible = document.querySelectorAll(`a.${INVERT_ME_CLASS}`);

	//********************************************
	// EXPORTS
	//********************************************
	win.initMap = initMap;

	//********************************************
	// INITIALIZATION
	//********************************************
	init();

	///////////////////////////////////////////////////////////////////////

	//********************************************
	// FUNCTIONS
	//********************************************
	function init() {
		// Show console welcome message
		console.info('You like to look under the hood? Check out the source code on github 😎\nhttps://github.com/schwarzdavid/schwarzdavid.rocks');

		// Show cookie hint
		if (!window.localStorage.getItem(COOKIE_ACCEPT_NAME)) {
			elCookieHint.style.display = 'block';
			elCookieHint.addEventListener('click', (e) => {
				e.preventDefault();
				window.localStorage.setItem(COOKIE_ACCEPT_NAME, true);
				elCookieHint.style.display = 'none';
			});
		}

		// Inverts content
		for(let i = 0; i < elsSensible.length; i++){
			const el = elsSensible[i];
			let invertedText = el.textContent.split('').reverse().join('');

			el.textContent = invertedText;
			el.classList.remove(INVERT_ME_CLASS);

			if(el.nodeName === 'A'){
				let prefix = el.href.split('#')[1];
				el.href = (prefix ? prefix + ':' : '') + invertedText;
			}
		}
	}

	function initMap() {
		let markerPosition = {
			lat: 48.202765,
			lng: 16.303881
		};

		let mapPosition = {
			lat: markerPosition.lat - 0.005,
			lng: markerPosition.lng
		};

		let map = new google.maps.Map(elMap, {
			center: mapPosition,
			zoom: 11,
			clickableIcons: false,
			disableDefaultUI: true,
			keyboardShortcuts: false,
			zoomControl: false,
			scrollwheel: false,
			styles: [{
				"stylers": [{
					"hue": "#000000"
				}, {
					saturation: -110
				}, {
					gamma: 1.7
				}]
			}]
		});

		let marker = new google.maps.Marker({
			position: markerPosition,
			map: map
		});
	}
}(window));