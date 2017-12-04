(function () {
	'use strict';

	//********************************************
	// CONSTANTS
	//********************************************
	const INPUT_FILLED_CLASS = 'filled';
	const FORM_URL = 'https://formspree.io/schwarz.david10@gmail.com';
	const FINISHED_TEXT = 'SUCCESSFULLY SENT!';

	//********************************************
	// SELECTORS
	//********************************************
	const _inputs = Array.from(document.querySelectorAll('#contact input, #contact textarea'));
	const _textArea = document.querySelector('#input-message');
	const _form = document.querySelector('#contact form');
	const _submitButton = document.querySelector('#contact button');

	//********************************************
	// REGISTER EVENTS
	//********************************************
	_textArea.addEventListener('input', onInput);
	_form.addEventListener('submit', onSubmit);

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
				requestAnimationFrame(() => {
					if (input.value) {
						return input.classList.add(INPUT_FILLED_CLASS);
					}
					input.classList.remove(INPUT_FILLED_CLASS);
				});
			});
		});
	}

	//********************************************
	// EVENT HANDLER
	//********************************************
	function onInput() {
		requestAnimationFrame(() => {
			_textArea.style.height = 'auto';
			_textArea.style.height = `${_textArea.scrollHeight}px`;
		});
	}

	function onSubmit(e) {
		e.preventDefault();

		if(!grecaptcha.getResponse()){
			alert('Please complete recaptcha!');
			return;
		}

		const httpRequest = new XMLHttpRequest();
		const payload = {};

		for(let input of _inputs){
			payload[input.name] = input.value;
		}

		httpRequest.open('POST', FORM_URL);
		httpRequest.setRequestHeader('Accept', 'application/json');
		httpRequest.setRequestHeader('Content-Type', 'application/json');

		httpRequest.addEventListener('error', () => {
			alert('Unexpected error occured. Please try again later!');
		});

		httpRequest.addEventListener('load', () => {
			const activeInputs = Array.from(document.querySelectorAll(`.${INPUT_FILLED_CLASS}`));

			_form.reset();
			requestAnimationFrame(() => {
				_submitButton.classList.add('finished');
				_submitButton.textContent = FINISHED_TEXT;

				for(let input of activeInputs){
					input.classList.remove(INPUT_FILLED_CLASS);
				}
			});
		});

		httpRequest.send(JSON.stringify(payload));
	}
}());