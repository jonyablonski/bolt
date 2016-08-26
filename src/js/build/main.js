(function ( window, document, undefined ) {

	'use strict';


	/**
	 * Cut the Mustard
	 */
	if ( !window.addEventListener && !document.querySelector ) {
		return;
	}


	/**
	 * Selectors
	 */

	 // Elements
	 var body = document.body;

	 // Classes
	 var enhanceclass = 'js',

	 // Files
    svgSymbols = 'svg/build/sprite.svg';


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
		ajax.onload = function(e) {
		  var div = document.createElement('div');
		  div.style.display = 'none';
		  div.innerHTML = ajax.responseText;
		  document.body.insertBefore(div, document.body.childNodes[0]);
		}
  	})();


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

	document.documentElement.className += ' ' + enhanceclass;

	document.addEventListener( 'click', clickEventHandler, false );

	window.addEventListener('popstate', popstateEventHandler, false);

	window.addEventListener( 'resize', onResize, false );

	window.addEventListener( 'scroll', onScroll, false );

})( window, document );