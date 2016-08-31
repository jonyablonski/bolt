(function ( window, document, undefined ) {

	'use strict';


	/**
	* Selectors
	*/

	// Elements
	var body = document.body;

	// Files
	var svgSymbols = 'sprite.svg';

	// Class Names
	var fontsLoaded = 'fonts-loaded';


	/**
		* Methods
		*/

	function removeQuotes( string ) {
		if ( typeof string === 'string' || string instanceof String ) {
			string = string.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, '');
		}
		return string;
	}


	var checkMedia = function() {
			var media = window.getComputedStyle( body,':after' ).getPropertyValue( 'content' );
			return removeQuotes( media );
	};


	var throttle = function( callback, limit ) {
		var wait = false;
		return function () {
			if ( !wait ) {
				callback.call();
				wait = true;
				setTimeout(function () {
					wait = false;
				}, limit );
			}
		};
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


	var getClosest = function (elem, selector) {
		var firstChar = selector.charAt(0);
		for ( ; elem && elem !== document; elem = elem.parentNode ) {
			if ( firstChar === '.' ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			}
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
					return elem;
				}
			}
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}
		}
		return false;
	};


	var getSiblings = function ( elem ) {
		var siblings = [];
		var sibling = elem.parentNode.firstChild;
		for ( ; sibling; sibling = sibling.nextSibling ) {
			if ( sibling.nodeType === 1 && sibling !== elem ) {
				siblings.push( sibling );
			}
		}
		return siblings;
	};


	var removeElement = function( element ) {
		if ( element.parentNode ) {
			element.parentNode.removeChild( element );
		}
	};


	var getURL = function ( url, success, error ) {
		if ( !window.XMLHttpRequest ) {
			return;
		}
		var request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			if ( request.readyState === 4 ) {
				if ( request.status !== 200 ) {
					if ( error && typeof error === 'function' ) {
						error( request.responseText, request );
					}
					return;
				}
				if ( success && typeof success === 'function' ) {
					success( request.responseText, request );
				}
			}
		};
		request.open( 'GET', url );
		request.send();
	};


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
		var fontA = new FontFaceObserver('Open Sans', {
			weight: 400
		});

		var fontB = new FontFaceObserver('Open Sans', {
			weight: 700
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


	var onResize = throttle( function() {
	}, 100);


	var onScroll = throttle( function() {
	}, 100);


	var clickEventHandler = function( event ) {
		var anchor = getClosest( event.target, 'a' );
	};


	var popstateEventHandler = function( event ) {
	};


	/**
	* Events/APIs/init
	*/

	if ( !supportsSvg() ) {
		iconsFallback();
	}

	document.addEventListener( 'click', clickEventHandler, false );

	window.addEventListener('popstate', popstateEventHandler, false);

	window.addEventListener( 'resize', onResize, false );

	window.addEventListener( 'scroll', onScroll, false );

})( window, document );
//# sourceMappingURL=maps/main.js.map
