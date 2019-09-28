const play = document.querySelector("#play");
play.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.setItem("portrait", window.getComputedStyle(portrait).getPropertyValue("background-image"));
    sessionStorage.setItem("nickname", nickname.value);
    window.location.href = "/gameroom.html";
});
const LINE_DURATION = 2;
const LINE_WIDTH_START = 5;

$(document).ready(function () {
    enableDrawingCanvas();
    resizeCanvas(window.innerWidth, window.innerHeight);
});
$(window).on("resize", function () {
    // var win = $(this); //this = window
    // if (win.height() >= 820) {
    //     /* ... */
    // }
    // if (win.width() >= 1280) {
    //     /* ... */
    // }
    resizeCanvas(window.innerWidth, window.innerHeight);
});
//////////////////////////
// Variable definitions //
//////////////////////////
let active = true;

let canvas;
let context;

let newWidth = 1000;
let newHeight = 800;

let mode = 2;
let pathMode = 1;
let spread = 2;

let lineDuration = LINE_DURATION;
// let lineFadeLinger = 1;
let lineWidthStart = LINE_WIDTH_START;
// let fadeDuration = 50;
let drawEveryFrame = 1; // Only adds a Point after these many "mousemove" events

let frame = 0;

let flipNext = true;

let points = new Array();

///////////////////////
// Program functions //
///////////////////////

// Find canvas reference & enable listeners
function enableDrawingCanvas() {
    if (canvas === undefined) {
        canvas = document.getElementById("myCanvas");
        context = canvas.getContext("2d");
        enableListeners();
        init();
    }
}

// Initialize animation start
function init() {
    draw();
}

// Draw current state
function draw() {
    if (active) {
        animatePoints();
        window.requestAnimFrame(draw);
    }
}

// Update mouse positions
function animatePoints() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    let duration = lineDuration * 1000 / 60;
    let point, lastPoint;

    if (pathMode === 2) {
        context.beginPath();
    }

    for (let i = 0; i < points.length; i++) {
        point = points[i];

        if (points[i - 1] !== undefined) {
            lastPoint = points[i - 1];
        } else {
            lastPoint = points[i];
        }

        point.lifetime += 1;

        if (point.lifetime > duration) {
            points.splice(i, 1);
            continue;
        }

        // Begin drawing stuff!
        let inc = (point.lifetime / duration); // 0 to 1 over lineDuration
        let dec = 1 - inc;

        let spreadRate;
        if (spread === 1) {
            spreadRate = lineWidthStart / (point.lifetime * 2);
        } // Lerp Decrease
        if (spread === 2) {
            spreadRate = lineWidthStart * (1 - inc);
        } // Linear Decrease

        //context.strokeStyle = lineColor;
        context.lineCap = "round"; // good one
        context.lineWidth = spreadRate;
        context.strokeStyle = "rgb(" + Math.floor(255) + "," +
            Math.floor(200 - (255 * inc)) + "," +
            Math.floor(200 - (255 * dec)) + ")";

        // let distance = Point.distance(lastPoint, point);
        // let midpoint = Point.midPoint(lastPoint, point);
        // let angle = Point.angle(lastPoint, point);

        if (pathMode === 1) {
            context.beginPath();
        }

        // if (mode === 1) {
        //     context.arc(midpoint.x, midpoint.y, distance / 2, angle, (angle + Math.PI), point.flip);
        // }

        if (mode === 2) {
            context.moveTo(lastPoint.x, lastPoint.y);
            context.lineTo(point.x, point.y);
        }

        if (pathMode === 1) {
            context.stroke();
            context.closePath();
        }
    }

    if (pathMode === 2) {
        context.stroke();
        context.closePath();
    }

    //if (points.length > 0) { console.log(spreadRate + "|" + points.length + " points alive."); }
}

function addPoint(x, y) {
    flipNext = !flipNext;
    let point = new Point(x, y, 0, flipNext);
    points.push(point);
}

//////////////////////////////
// Less Important functions //
//////////////////////////////

// RequestAnimFrame definition
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Update canvas dimensions based on input
function resizeCanvas(w, h) {
    if (context !== undefined) {
        context.canvas.width = w;
        context.canvas.height = h;

        newWidth = w;
        newHeight = h;
    }
}

// Listeners for mouse and touch events
function enableListeners() {

    //********* Mouse Listeners *********//
    $("#myCanvas").on("mousemove", function (e) {
        if (frame === drawEveryFrame) {
            addPoint(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            frame = 0;
        }
        frame++;
    });

    // $("#myCanvas").on("mouseover", function (e) {});
    // $("#myCanvas").on("mouseleave", function (e) {});

    //********* Touch Listeners *********//
    // $("#myCanvas").on("touchstart", function (e) {
    //     let touch = e.touches[0];
    // });
    // $("#myCanvas").on("touchmove", function (e) {
    //     let touch = e.touches[0];
    // });
    // $("#myCanvas").on("touchend", function (e) {});
}


// POINT CLASS
// Cartersian location of where mouse location
// was previously at. 
// Used to draw arcs between Points.
let Point = class Point {

    // Define class constructor
    constructor(x, y, lifetime, flip) {
        this.x = x;
        this.y = y;
        this.lifetime = lifetime;
        this.flip = flip;
    }

    // Get the distance between a & b
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    // Get the mid point between a & b
    static midPoint(a, b) {
        const mx = a.x + (b.x - a.x) * 0.5;
        const my = a.y + (b.y - a.y) * 0.5;

        return new Point(mx, my);
    }

    // Get the angle between a & b
    static angle(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.atan2(dy, dx);
    }

    // Simple getter for printing
    get pos() {
        return this.x + "," + this.y;
    }
}