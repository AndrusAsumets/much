var much = (function () {
	
	/**
	 * Provides requestAnimationFrame in a cross browser way.
	 * @author greggman / http://greggman.com/
	 */

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (function() {
			return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback, element) {
					window.setTimeout(callback, 1000 / 60 );
				};
			})
		();
	}

	/**
 	* @author Hans Eklund, North Kingdom
 	*
 	* Modified and packaged into a module by Andrus Asumets.
 	*/

 	var toomuch = {};
	var elements = [];
	var elementId;
	var element = {}
	var index = 0;
	var animationFrame;
	var prefixedTransform;

    var settings = {
    	element: null,
        currentScale: 0.5,
        currentRotation: 0,
        minScale: 0.5,
        maxScale: 1.5,
        restrict: false,
        easing: 0,
        boundaries: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        dragStartX: 0, 
        dragStartY: 0, 
        dragX: 0, 
        dragY: 0,
        dragdDX: 0,
        dragdDY: 0,
        dragging: false, 
        touchStartDistance: 0,
        touchStartAngle: 0,
        posX: 0,
        posY: 0,
        velocityX: 0,
        velocityY: 0,
        clientX: 0,
        clientY: 0
    }

	toomuch.add = function (options) {
		if('transform' in document.body.style) {
			prefixedTransform = 'transform';
		} else if('webkitTransform' in document.body.style) {
			prefixedTransform = 'webkitTransform';
		}

		var elementSettings = merge_options(settings, options);

		elementSettings.elementId = options.element.id;
		elements.push(elementSettings);
		elementId = options.element.id;

		var elementHTML = document.getElementById(elementId);
		if(window.PointerEvent) {
			element.pointers = [];

			elementHTML.addEventListener('pointerdown', pointerDownHandler, false);
		} else {
			elementHTML.addEventListener('touchstart', onTouchStart);
		}

		setElement(elementId);
		startAnimationFrame();
		
		return elementSettings;
	}

	toomuch.stop = function() {
		stopAnimationFrame();
		elements = [];
		elementId = null;
		element = {};
		index = 0;
	}

	toomuch.remove = function(element) {
		for (i = 0; i < elements.length; i++) {
			if (elements[i].element.id == element.id) {
				var j = 0;

				elements.splice(i, 1);

				j = i - 1;
				if (j < 0) { j = 0 };
				index = j;

				break;
			}
		}

		if (elements.length > 0) {
			elementId = elements[index].element.id;
			setElement(elementId);	
		}
		else {
			stopAnimationFrame();
		}
	}
	
	toomuch.data = function() {		
		return elements;		
	}

	function merge_options(obj1,obj2) {
	    var obj3 = {};

	    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }

	    return obj3;
	}

	function setElement(id) {
		for (i = 0; i < elements.length; i++) {
			if (elements[i].elementId === id) {
				index = i;
				element = elements[index];

				break;
			}
		}
	}

	function onTouchStart(event) {
		elementId = this.id;
		setElement(elementId);

		if(event.touches.length === 1) {
			if(!element.dragging) {
				document.addEventListener('touchmove', onTouchMove);
				document.addEventListener('touchend', onTouchEnd);
				document.addEventListener('touchcancel', onTouchEnd);	

				handleDragStart(event.touches[0].clientX , event.touches[0].clientY);
			}
		} else if(event.touches.length === 2) {
			handleGestureStart(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY);
		}

		startAnimationFrame();
	}

	function onTouchMove(event) {
		event.preventDefault();

		if(event.touches.length === 1) {
			handleDragging(event.touches[0].clientX, event.touches[0].clientY);
		} else if(event.touches.length === 2) {
			handleGesture(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY);
		}
	}

	function onTouchEnd(event) {
		if(event.touches.length === 0 && element.dragging) {
			//fix the freeze bug
			for (i = 0; i < elements.length; i++) { elements[i].dragging = false }; 

			document.removeEventListener('touchmove', onTouchMove);
			document.removeEventListener('touchend', onTouchEnd);
			document.removeEventListener('touchcancel', onTouchEnd);
		} else if(event.touches.length === 1) {
			handleGestureStop();
			handleDragStart(event.touches[0].clientX, event.touches[0].clientY);

			for (i = 0; i < elements.length; i++) { elements[i].dragging = false }; 

		}

		return true;
	}

	function indexOfPointer(pointerId){
		for (var i = 0; i < element.pointers.length; i++) {
			if(element.pointers[i].pointerId === pointerId) {
		   		return i;
			}
		}
		return -1;
	}

	function pointerDownHandler(event) {
		elementId = this.id;
		setElement(elementId);

		var pointerIndex = indexOfPointer(event.pointerId);

		if(pointerIndex < 0) {
			element.pointers.push(event);
		} else {
			element.pointers[pointerIndex] = event;
		}
		if(input.pointers.length === 1) {
			handleDragStart(element.pointers[0].clientX , element.pointers[0].clientY);

			window.addEventListener('pointermove', pointerMoveHandler, false);
			window.addEventListener('pointerup', pointerUpHandler, false);
		} else if(input.pointers.length === 2) {
			handleGestureStart(element.pointers[0].clientX, element.pointers[0].clientY, element.pointers[1].clientX, element.pointers[1].clientY);
		}
	}

	function pointerMoveHandler(event) {
		var pointerIndex = indexOfPointer(event.pointerId);

		if(pointerIndex < 0) {
			input.pointers.push(event);
		} else {
			input.pointers[pointerIndex] = event;
		}

		if(input.pointers.length === 1) {
			handleDragging(element.pointers[0].clientX, element.pointers[0].clientY);
		} else if(input.pointers.length === 2 ) {
			handleGesture(element.pointers[0].clientX, element.pointers[0].clientY, element.pointers[1].clientX, element.pointers[1].clientY);
		}
	}

	function pointerUpHandler(event) {
		element.pointers = [];

		window.removeEventListener('pointermove', pointerMoveHandler, false);
		window.removeEventListener('pointerup', pointerUpHandler, false);

		handleDragStop();
		handleGestureStop();
	}

	function handleDragStart(x, y) {

		element.dragging = true;
		element.dragX = x;
		element.dragY = y;
	}

	function handleDragging(x, y) {
		if(element.dragging) {
			element.dragdDX += x - element.dragX;
			element.dragdDY += y - element.dragY;
			
			element.dragX = x;
			element.dragY = y;
		}
	}

	function handleGestureStart(x1, y1, x2, y2) {
		element.isGesture = true;

		//calculate distance and angle between fingers
		var dx = x2 - x1;
		var dy = y2 - y1;

		element.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
		element.touchStartAngle = Math.atan2(dy, dx);

		//we also store the current scale and rotation of the actual object we are affecting. This is needed because to enable incremental rotation/scaling.
		element.startScale = element.currentScale;
		element.startAngle = element.currentRotation;
	}

	function handleGesture(x1, y1, x2, y2) {
		if(element.isGesture) {

			//calculate distance and angle between fingers
			var dx = x2 - x1;
			var dy = y2 - y1;
			var touchDistance = Math.sqrt(dx * dx + dy * dy);
			var touchAngle = Math.atan2(dy, dx);

			//calculate the difference between current touch values and the start values
			var scalePixelChange = touchDistance - element.touchStartDistance;
			var angleChange = touchAngle - element.touchStartAngle;

			//calculate how much this should affect the actual object
			element.currentScale = element.startScale + scalePixelChange * 0.01;
			element.currentRotation = element.startAngle + (angleChange * 180 / Math.PI);

			if(element.currentScale < element.minScale) element.currentScale = element.minScale;
			if(element.currentScale > element.maxScale) element.currentScale = element.maxScale;
		}
	}

	function handleGestureStop() {
		element.isGesture = false;
	}

	function onAnimationFrame() {
		animationFrame = requestAnimationFrame(onAnimationFrame);

		if(elements.length === 0) { return };

		var elementHTML = document.getElementById(elementId);

		if(element.dragdDX !== 0) element.velocityX = element.dragdDX;
		if(element.dragdDY !== 0) element.velocityY = element.dragdDY;

		element.posX += element.velocityX;
		element.posY += element.velocityY;

		if(element.restrict) {
			//restict horizontally
			if(element.posX < element.boundaries.left) element.posX = element.boundaries.left;
			else if(element.posX > element.boundaries.right) element.posX = element.boundaries.right;

			//restict vertically
			if(element.posY < element.boundaries.top) element.posY = element.boundaries.top;
			else if(element.posY > element.boundaries.bottom) element.posY = element.boundaries.bottom;
		}

		//set the transform
		elementHTML.style[prefixedTransform] = 'translate(' + element.posX + 'px,' + element.posY + 'px) rotate(' + element.currentRotation + 'deg) scale(' + element.currentScale + ')';

		element.velocityX = element.velocityX * element.easing;
		element.velocityY = element.velocityY * element.easing;

		element.dragdDX = 0;
		element.dragdDY = 0;

		if (typeof element.callback == 'function') {
			element.callback.call(null, element);
		}

		elements[index] = element;
	}

	function startAnimationFrame() {
	    if (!animationFrame) {
			onAnimationFrame();
	    }
	}

	function stopAnimationFrame() {
	    if (animationFrame) {
			window.cancelAnimationFrame(animationFrame);
			animationFrame = undefined;
	    }
	}

	return toomuch;
}());
