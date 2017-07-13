(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		document.querySelector('#trigger').addEventListener('click', function () {
			if(document.body.dataset.active === 'teaser') {
				delete document.body.dataset.active;
				return;
			}
			document.body.dataset.active = 'teaser';
		});

		document.querySelector('#resume-trigger').addEventListener('click', function () {
			document.body.dataset.active = 'resume';
		});
	});
}());