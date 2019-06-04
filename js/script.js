var height = 220;
var width = 227;

var mX = 1000;
var mY = 0;

var c=document.getElementById("canvas");
var ctx=c.getContext("2d");

// space between dots
var s = 12;

// offset from top left corner of canvas
var mx = -60;
var my = -120;

document.getElementById('wrapper').onmousemove = setMouseLoc;

var grd = ctx.createLinearGradient(0,0, width, height);
grd.addColorStop(0,"#090");
grd.addColorStop(1,"#65c");

ctx.fillStyle="#fff";
ctx.fillRect(0,0,width, height);

ctx.fillStyle=grd;
var c = [[7*s+mx,14*s+my], [7*s+mx, 26*s+my], 
	[8*s+mx,26*s+my], [9*s+mx,26*s+my], [8*s+mx, 25*s+my], [9*s+mx, 25*s+my], 
	[8*s+mx, 24*s+my], [9*s+mx, 24*s+my], 	[8*s+mx, 23*s+my], [9*s+mx, 23*s+my], 
	[8*s+mx, 22*s+my], [9*s+mx, 22*s+my], [8*s+mx,21*s+my], [9*s+mx,21*s+my], 
	[8*s+mx,20*s+my], [9*s+mx,20*s+my], [8*s+mx,19*s+my], [9*s+mx,19*s+my], 
	[8*s+mx,18*s+my], [9*s+mx,18*s+my],	[8*s+mx,17*s+my], [9*s+mx,17*s+my], 
	[8*s+mx,16*s+my], [9*s+mx,16*s+my], [8*s+mx,15*s+my], [9*s+mx,15*s+my],
	[8*s+mx,14*s+my], [9*s+mx,14*s+my], [8*s+mx,13*s+my], [9*s+mx,13*s+my], 
	[9*s+mx,12*s+my],
				
	[10*s+mx, 22*s+my], [10*s+mx, 21*s+my], 
	[11*s+mx, 23*s+my], [11*s+mx, 22*s+my], [11*s+mx, 21*s+my], [11*s+mx, 20*s+my], 
	[12*s+mx, 26*s+my], [12*s+mx, 24*s+my], [12*s+mx, 23*s+my], [12*s+mx, 20*s+my], 
	[12*s+mx, 19*s+my],
	[13*s+mx, 26*s+my], [13*s+mx, 25*s+my], [13*s+mx, 24*s+my], [13*s+mx, 19*s+my], 
	[14*s+mx, 26*s+my], [14*s+mx, 25*s+my], [14*s+mx, 19*s+my],

	// the r
	[17*s+mx, 26*s+my], [17*s+mx, 20*s+my], 
	[18*s+mx, 26*s+my], [18*s+mx, 25*s+my], [18*s+mx, 24*s+my], [18*s+mx, 23*s+my], 
	[18*s+mx, 22*s+my],	[18*s+mx, 21*s+my], [18*s+mx, 20*s+my], [18*s+mx, 19*s+my],
	[19*s+mx, 26*s+my], [19*s+mx, 25*s+my], [19*s+mx, 24*s+my], [19*s+mx, 23*s+my], 
	[19*s+mx, 22*s+my], [19*s+mx, 21*s+my],
	[20*s+mx, 26*s+my], [20*s+mx, 21*s+my], [20*s+mx, 20*s+my],
	[21*s+mx, 21*s+my], [21*s+mx, 20*s+my],
	[22*s+mx, 22*s+my], [22*s+mx, 21*s+my]];

// circles made right to left bottom up
c.sort(function (x, y) {
    var n = y[1] - x[1];
    if (n !== 0) {
        return n;
    }
    return y[0] - x[0];
});

function render() { 

	ctx.clearRect(0, 0, width, height);

	for(var i = 0; i < c.length; i++){
	    ctx.beginPath();
	   	var d = Math.sqrt( (mX-c[i][0])*(mX-c[i][0]) + (mY-c[i][1])*(mY-c[i][1]) );
	    ctx.arc(c[i][0], c[i][1], Math.max(20 - d*0.1, 3.2), 0, Math.PI * 2);
	    ctx.lineWidth = 2;
    	ctx.strokeStyle = '#222';
    	ctx.stroke();
	   	ctx.fill();
	}
}

function setMouseLoc(event) {
    var rect = ctx.canvas.getBoundingClientRect();
    mX = event.clientX - rect.left;
    mY = event.clientY - rect.top;
    render();
}

render();