window.addEventListener("load", () => {
    // const frame = document.querySelector("#canvas-frame");
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    // resizing inside window onload
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // canvas.width = 500;
    // canvas.height = 500;
    console.log(canvas.offsetWidth, canvas.offsetHeight)
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
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        console.log(e.clientX, e.clientY);
        console.log(rect.left, rect.top)
    }
    // console.log(canvas.offsetLeft, canvas.offsetTop);
    // eventListeners
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", finish);
    canvas.addEventListener("mousemove", draw);
});