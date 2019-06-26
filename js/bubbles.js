// Get the HTML5 canvas to be animated on
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

// Animation variables
var time = 0; // Animation timer, boomerang from start back to start
var timeMin = 0;
var timeMax = 1000;
var timeChange = -1; // Boomerang direction
var timeSpeed = 4;
var flow = -1; // Bubbles flow, top-down or bottom-up
var flowCheckbox = document.getElementById("flowCheckbox")
var framerate = 52; // Milliseconds between frames
var interval; // Interval element
var paused = false;

// Bubble variables
var circles = []; // array of circles to draw
var r = 35; // circle starting radius
var radialGrowth = 0.1; // Bubble growth per frame, in px
var minHue = 160; // Aquamarinish
var maxHue = 360; // Violet

/* Runs a 'bubble' step/frame, bubbling all circles and creating new ones */
function bubble() {
	// Update time, run backwards if ends reached
	if (time >= timeMax || time <= timeMin) {
		timeChange *= -1;
	}
	time += timeSpeed * timeChange;

	// Add fresh circles to the mix
	if (time % 3 == 0) { // Not every frame though
		for (var i = 0; i < 3; i++) { // 3 at a time
			circles.push(freshCircle());
		}
	}

	// Bubble every circle
	for(var i = 0; i < circles.length; i++){
		var circle = circles[i];
		// Remove out-of-bound circles
		if (isOutOfBounds(circle.y)) {
			circles.splice(i, 1);
		} else {
			ctx.beginPath();
		    ctx.arc(
		    	circle.x,
		    	circle.y += 2 * flow, // y position grows towards flow
		    	circle.r += radialGrowth, // Radius grows as circle ages
		    	0, 6.2832); // Full circle (value in radians)
	    	ctx.fillStyle = "hsl(" + getCircleHue(circle.x, circle.y) + ", 90%, 30%)";
	    	ctx.fill();
	    }
	}
}

/* To start the animation */
function init() {
	// Set a gradient background to start, from top to bottom of screen
	var initGradient = ctx.createLinearGradient(0, 0, 0, height);
	initGradient.addColorStop(0, "#119679"); // Aqua-ish
	initGradient.addColorStop(1, "#160e91"); // Navy-ish
	ctx.fillStyle = initGradient;
	ctx.fillRect(0, 0, width, height);

	// Run a bubble step every framerate milliseconds
	interval = setInterval(bubble, framerate);
}

/* Circle object with (x, y) co-ordinate and radius */
function Circle(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

/* Checks if object is out of bounds */
function isOutOfBounds(y) {
	// Allow some room for radius since y represents object centre
	return y < -50 || y > (height + 50);
}

/* Gets the circle's destined hue, uses the global time variable */
function getCircleHue(x, y) {
	// Cycle between hues, from its starting destination to its highest point
	// and also depending on the global time variable for the light-shifting
	// effect
	return minHue + (((time + y)/(1000 + height)) * (maxHue - minHue));
}

/* Creates a new circle somewhere at the bottom of the screen */
function freshCircle() {
	// The y coordinate depends on flow which is {-1, 1}
	// so y will always be either 0 - r or height + r
	return new Circle(
		Math.random() * width,
		-0.5 * flow * height + 0.5 * height + r * -flow,
		r
	);
}

/* Pause the animations */
function pause() {
	if (!paused) {
		paused = true;
		document.getElementById("pauseToggle").classList.add("paused");
		interval = clearTimeout(interval);
	}
	else {
		paused = false;
		document.getElementById("pauseToggle").classList.remove("paused");
		interval = setInterval(bubble, framerate);
	}
}

/* Changes direction of bubble movement */
function changeFlow() {
	circles = [];
	if (flowCheckbox.checked) {
		flow = 1;
	} else {
		flow = -1;
	}
}

init();
