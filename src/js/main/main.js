(function ( window, document, undefined ) {

	'use strict';


	 /**
	 * Selectors
	 */

	// Files
	var svgSymbols = 'sprite.svg';

	// Class Names
	var fontsLoaded = 'fonts-loaded';

	// Elements
	var checklist = document.getElementById('js-checklist');
	var inputCount = checklist.querySelectorAll('.control').length;
	var progressBar = document.getElementById('js-progress-bar');
	var progressCount = document.getElementById('js-progress-count');


	/**
	* Methods
	*/

	var loadSVG = (function() {
		var ajax = new XMLHttpRequest();
		ajax.open('GET', svgSymbols, true);
		ajax.send();
		ajax.onload = function() {
			var div = document.createElement('div');
			div.style.display = 'none';
			div.innerHTML = ajax.responseText;
			document.body.insertBefore(div, document.body.childNodes[0]);
		};
	})();

	var loadFonts = (function() {
		var fontA = new FontFaceObserver('Gotham Book Regular', {
			weight: 400
		});

		var fontB = new FontFaceObserver('Gotham Bold Regular', {
			weight: 800
		});

		Promise
			.all([
				fontA.check(),
				fontB.check()
			])
			.then(function() {
				document.body.className += ' ' + fontsLoaded;
		});
	})();

	var supportsSvg = function() {
		var div = document.createElement('div');
		div.innerHTML = '<svg/>';
		return (div.firstChild && div.firstChild.namespaceURI) === 'http://www.w3.org/2000/svg';
	};

	var iconsFallback = function() {

		// Get all SVGs on the page and how many there are
		var svgs = document.getElementsByTagName('svg'),
		svgL = svgs.length;

		// Loop through all SVGs on the page
		while( svgL-- ) {

			// If SVG isn't the first one, continue ...
			if(svgL > 0) {

				// Get title attribute of SVG
				var svgTitle = svgs[svgL].getAttribute('title');

				// Get all  elements from each SVG
				var uses = svgs[svgL].getElementsByTagName('use'),
				usesL = uses.length;

				// Loop through all  elements within an SVG
				while( usesL-- ) {

					// Get the 'xlink:href' attributes
					var svgId = uses[usesL].getAttribute('xlink:href');

					// Remove first character from variable (This removes the #)
					svgId = svgId.substring(1, svgId.length);

					// Create New Image
					var newImg = document.createElement('img');

					// Assign src attribute
					newImg.src = 'assets/dist/icons/png/' + svgId + '.png';

					// Assign alt attribute
					newImg.alt = svgTitle ? svgTitle : '';

					// Insert new element straight after the SVG in question
					svgs[svgL].parentNode.insertBefore(newImg, svgs[svgL].nextSibling);

				}

				// Remove all SVG nodes
				svgs[svgL].parentNode.removeChild(svgs[svgL]);
			}
		}
	};

	var forEach = function ( collection, callback, scope ) {
		if ( Object.prototype.toString.call( collection ) === '[object Object]') {
			for ( var prop in collection ) {
				if ( Object.prototype.hasOwnProperty.call( collection, prop )) {
					callback.call( scope, collection[prop], prop, collection );
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	var checklistProgress = function() {
		var checklistChildren = checklist.querySelectorAll('input');
		var checkedCount = 0;
		forEach(checklistChildren, function (value) {
			if (value.checked) {
				checkedCount++;
			}
		});
		return checkedCount / inputCount * 100 + '%';
	};

	var updateChecklistProgress = function() {
		progressBar.style.width = checklistProgress();
		progressCount.innerHTML = parseFloat(checklistProgress()).toFixed(0) + '%';
	};

	var resetChecklist = function() {
		localStorage.clear();
		document.location.reload(!0);
	};

	var clickEventHandler = function( event ) {
		if ( event.target.type === 'reset' ) {
			resetChecklist();
		}
	};


	/**
	* Events/APIs/init
	*/

	if ( !supportsSvg() ) {
		iconsFallback();
	}

	$( '#js-checklist' ).garlic();

	updateChecklistProgress();

	checklist.addEventListener('change', function(event) {
		updateChecklistProgress();
	});

	document.addEventListener( 'click', clickEventHandler, false );

})( window, document );