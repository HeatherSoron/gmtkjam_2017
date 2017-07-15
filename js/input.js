var keysHeld = {};
var mouseState = new Point(0,0); // we'll add some other data here, but we want Point methods

function handleKeyDown(e) {
	var keyName = keyMap[e.keyCode];
	if (keyName && e.target.tagName != 'TEXTAREA') {
	console.log(keyName);
		keysHeld[keyName] = true;
		// e.preventDefault is used here to prevent scrolling when the spacebar is pressed
		e.preventDefault();
	}
}

function handleKeyUp(e) {
	var keyName = keyMap[e.keyCode];
	if (keyName && e.target.tagName != 'TEXTAREA') {
		keysHeld[keyName] = false;
		e.preventDefault();
	}
}

// checks whether a key is pressed, and also sets state to non-pressed
// this is useful for discrete press events, as opposed to continuous while-held events
function clearKeyDown(keyName) {
	var down = keysHeld[keyName];
	keysHeld[keyName] = false;
	return down;
}

function handleMouseMove(e) {
	mouseState.x = e.offsetX
	mouseState.y = e.offsetY
}

function handleMouseDown(e) {
	// only left click
	if (e.button == 0) {
		mouseState.button = true;
	}
}

function handleMouseUp(e) {
	// only left click
	if (e.button == 0) {
		mouseState.button = false;
	}
}
