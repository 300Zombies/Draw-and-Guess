window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    // resizing inside window onload
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // variables
    let drawing = false;

    function start(e) {
        console.log("started");
        drawing = true;
        draw(e);
    }

    function finish() {
        console.log("finished");
        drawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;
        console.log("drawing");
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }
    // eventListeners
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", finish);
    canvas.addEventListener("mousemove", draw);
});