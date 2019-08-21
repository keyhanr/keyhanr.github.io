var krCanvas = document.getElementById("kr");
var krContext = krCanvas.getContext("2d");
var rect = krCanvas.getBoundingClientRect();
var krWidth = krCanvas.width;
var krHeight = krCanvas.height;
var projectsDiv = document.getElementById("projects");

var leftMargin = 12; // Offset from left of canvas
var topMargin = -55; // Offset from top of canvas
var dotSpacing = 12; // Space between dots
var minRadius = 6;
var maxRadius = 26;
var grad0 = "#090";
var grad1 = "#93f";

// Will store coordinates on the canvas for circles forming the letters
var canvasCoords = [];

// Global mouse coordinates (begin off-screen)
var mX = -100;
var mY = -100;

function render() { 
	// Clear the canvas
	krContext.clearRect(0, 0, krWidth, krHeight);

	// Draw each circle
	for(var i = 0; i < canvasCoords.length; i++){
		var c = canvasCoords[i];
	    krContext.beginPath();
	    krContext.arc(
	    	c.x, 
	    	c.y, 
	    	getCircleRadius(distance(mX, mY, c.x, c.y)), 
	    	0, 
	    	Math.PI * 2);
	    krContext.lineWidth = 0.5;
    	krContext.strokeStyle = '#222'; // Gray border
    	krContext.stroke();
	   	krContext.fill();
	}
}

/* Start the drawing and animations */
function init() {
	document.onmousemove = setMouseLoc;
	krCanvas.style.zIndex = "3";

	// Set the colour gradient
	var krGradient = krContext.createLinearGradient(0,0, krWidth, krHeight);
	krGradient.addColorStop(0, grad0);
	krGradient.addColorStop(1, grad1);
	krContext.fillStyle = krGradient;

	// Array of points that correspond to a grid containing the letter dots
	var gridCoords = [
		// Long line of the k
		[7, 14], [7, 26], 
		[8, 26], [9, 26], [8, 25], [9, 25], 
		[8, 24], [9, 24], [8, 23], [9, 23], 
		[8, 22], [9, 22], [8, 21], [9, 21], 
		[8, 20], [9, 20], [8, 19], [9, 19], 
		[8, 18], [9, 18], [8, 17], [9, 17], 
		[8, 16], [9, 16], [8, 15], [9, 15],
		[8, 14], [9, 14], [8, 13], [9, 13], 
		[9, 12],
		// < of the k
		[10, 22], [10, 21], 
		[11, 23], [11, 22], [11, 21], [11, 20], 
		[12, 26], [12, 24], [12, 23], [12, 20], 
		[12, 19],
		[13, 26], [13, 25], [13, 24], [13, 19], 
		[14, 26], [14, 25], [14, 19],

		// The r
		[17, 26], [17, 20], 
		[18, 26], [18, 25], [18, 24], [18, 23], 
		[18, 22], [18, 21], [18, 20], [18, 19],
		[19, 26], [19, 25], [19, 24], [19, 23], 
		[19, 22], [19, 21],
		[20, 26], [20, 21], [20, 20],
		[21, 21], [21, 20],
		[22, 22], [22, 21]
	];

	// Order coords from right to left, bottom to top so they overlap well
	gridCoords.sort(function (a, b) {
	    var n = b[1] - a[1];
	    if (n !== 0) {
	        return n;
	    }
	    return b[0] - a[0];
	});

	// Turn grid coordinates to canvas coordinates
	for (var i = 0; i < gridCoords.length; i++) {
		canvasCoords.push(new Coord(
			gridCoords[i][0] * dotSpacing + leftMargin,
			gridCoords[i][1] * dotSpacing + topMargin)
		);
	}

	render();
}

/* Coordinate object */
function Coord(x, y) {
	this.x = x;
	this.y = y;
}

/* Get the distance between (x1, y1) and (x2, y2) */
function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

/* Get the radius of the circle depending on how close the cursor is */
function getCircleRadius(distance) {
	return Math.max(minRadius, maxRadius - (distance * 0.12));
}

/* Show the kr canvas, hide the porjects div */
function showKr() {
	krCanvas.style.zIndex = "3";
	krCanvas.classList.remove("hidden");
	krCanvas.classList.add("krShown");
	projectsDiv.classList.remove("projectsShown");
	projectsDiv.classList.add("hidden");
}

/* Show the projects div, hide the kr canvas */
function showProjects() {
	krCanvas.classList.remove("krShown");
	krCanvas.classList.add("hidden");
	projectsDiv.classList.remove("hidden");
	projectsDiv.classList.add("projectsShown");
	krCanvas.style.zIndex = "-1";
}

/* Switch between kr canvas and projects div */
function switchVisible() {
	if (projectsDiv.classList.contains("hidden")) {
		showProjects();
	} else {
		projectsDiv.classList.remove("projectsShown");
		showKr();
	}
}

/* Sets the global mosue coordinates */
function setMouseLoc(event) {
    mX = event.clientX - rect.left;
    mY = event.clientY - rect.top;
    render();
}

init();