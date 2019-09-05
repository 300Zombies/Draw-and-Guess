// "use strict";
window.addEventListener("load", () => { // change jQuery back to vanilla JavaScript
    const socket = io();
    const form = document.querySelector("form");
    const m = document.querySelector("#m");
    const name = sessionStorage.getItem("name");
    sessionStorage.removeItem("name");
    form.onsubmit = (e) => {
        e.preventDefault();
        socket.emit("chat message", `${name}: ${m.value}`);
        m.value = "";
        return false
    }
    socket.on("chat message", (msg) => {
        const messages = document.querySelector("#messages");
        const text = document.createElement("div");

        text.textContent = msg;
        messages.appendChild(text);
        messages.scrollTop = messages.scrollHeight;
    });
    const canvas = document.getElementsByClassName("whiteboard")[0];
    const colors = document.getElementsByClassName("color");
    const ctx = canvas.getContext("2d");
    const frame = document.querySelector(".frame");

    let current = {
        color: "black",
    };
    let drawing = false;

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseUp, false);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

    // Touch support for mobile devices (removed)
    canvas.addEventListener("touchstart", onMouseDown, false);
    canvas.addEventListener("touchend", onMouseUp, false);
    canvas.addEventListener("touchcancel", onMouseUp, false);
    canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

    for (let i = 0; i < colors.length; i++) { // colors
        colors[i].style.background = colors[i].className.split(" ")[1];
        colors[i].addEventListener("click", onColorUpdate, false);
    }

    socket.on("drawing", onDrawingEvent);

    window.addEventListener("resize", onResize, false);
    onResize();

    function drawLine(x0, y0, x1, y1, color, emit) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        if (!emit) {
            return;
        }
        let w = canvas.width;
        let h = canvas.height;

        socket.emit("drawing", {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color
        });
    }

    function onMouseDown(e) {
        drawing = true;
        current.x = e.clientX - canvas.offsetLeft;
        current.y = e.clientY - canvas.offsetTop;
        drawLine(current.x, current.y, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, current.color, true);
    }

    function onMouseUp() {
        // if (!drawing) {
        //     return;
        // }
        drawing = false;
    }

    function onMouseMove(e) { // TODO: handle condition where mousedown in canvas and mouseup outside canvas
        if (!drawing) {
            return;
        }
        drawLine(current.x, current.y, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, current.color, true);
        current.x = e.clientX - canvas.offsetLeft;
        current.y = e.clientY - canvas.offsetTop;
        if (!drawing) {
            return;
        }
    }

    function onColorUpdate(e) {
        current.color = e.target.className.split(" ")[1];
    }

    // limit the number of events per second
    function throttle(callback, delay) {
        let previousCall = new Date().getTime();
        return function () {
            let time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    function onDrawingEvent(data) {
        let w = canvas.width;
        let h = canvas.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

    // make the canvas fill its parent
    function onResize() {
        canvas.width = frame.offsetWidth;
        canvas.height = frame.offsetHeight;
    }
});