(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const INPUT_FILLED_CLASS = 'filled';

	//********************************************
	// SELECTORS
	//********************************************
	const _inputs = Array.from(document.querySelectorAll('#contact input, #contact textarea'));

	//********************************************
	// INITIALIZE
	//********************************************
	init();

	///////////////////////////////////////////////////////////////////////

	//********************************************
	// FUNCTIONS
	//********************************************
	function init() {
		_inputs.forEach((input) => {
			input.addEventListener('keyup', () => {
				if(input.value){
					return input.classList.add(INPUT_FILLED_CLASS);
				}
				el.classList.remove(INPUT_FILLED_CLASS);
			});
		});
	}
}());