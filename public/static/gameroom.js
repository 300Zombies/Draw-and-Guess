// "use strict";
window.addEventListener("load", () => { // change jQuery back to vanilla JavaScript
    // timer for timeouts
    let timer;
    // test area
    const countdown = document.querySelector(".countdown");
    // countdown.addEventListener("click", () => {
    //     countdown.classList.toggle("counting-down");
    // });
    const timerBox = document.querySelector(".timer-box");
    // timer.addEventListener("click", () => {
    //     countdown.classList.remove("counting-down");
    // }, true);
    const info = document.querySelector(".info");
    const panel = document.querySelector(".info-panel");
    const headline = document.querySelector(".info-header h1")
    const btnY = document.querySelector(".info-yes");
    const btnN = document.querySelector(".info-no"); // redirect to homepage
    const infoBtns = document.querySelectorAll(".info-btn");
    const selectL = document.querySelector(".select-left");
    const selectR = document.querySelector(".select-right");
    const selectBtns = document.querySelectorAll(".select-btn");
    const nextOne = document.querySelector(".next-one");
    const barrier = document.querySelector(".barrier");
    btnY.addEventListener("click", () => {
        console.log("btnY clicked")
        socket.emit("game start", "let the games begin");
        headline.classList.remove("start-h1");
        headline.classList.add("select-h1");
        infoBtns.forEach((e) => {
            // display none info btns
            e.classList.add("deactivated");
        });
        selectBtns.forEach((e) => {
            // display topic selection btns
            e.classList.remove("deactivated");
        });
    });
    // only drawer has topic selection event
    selectBtns.forEach((e) => {
        e.addEventListener("click", function () {
            // drawer picked topic and send to server
            socket.emit("round start", this.textContent);
            // deactivated barrier for drawer
            barrier.classList.add("deactivated");
            info.classList.add("deactivated");
            // stop current timeout
            // start drawing timeout
        });
    });
    // test area

    const socket = io();
    // chat
    const form = document.querySelector("form");
    const m = document.querySelector("#m");
    const name = (sessionStorage.getItem("name")).toString();
    const left = document.querySelector(".left");
    // sessionStorage.removeItem("name");
    socket.emit("join room", name);
    socket.on("render player", (players) => {
        console.log("My socket.id =", socket.id);
        let i = players.findIndex((e) => { // e === elements
            return e.id === socket.id
        });
        console.log("My index in players is", i);
        if (i === 0) {
            // something went wrong here
            // players[0] not always drawer
            console.log("I'm da host!")
            headline.classList.remove("wait-h1")
            headline.classList.add("start-h1")
            infoBtns.forEach(e => {
                e.classList.remove("deactivated")
            });
        } else {
            console.log("I'm da player!")
        }
        nextOne.classList.add("deactivated");
        // render player list
        left.innerHTML = "";
        console.log(`${players[players.length-1].name} joined the game`);
        console.log("players", players);
        players.forEach((e) => {
            let card = document.createElement("div");
            card.classList.add("card");
            let role = document.createElement("div");
            role.classList.add("role");
            let pic = document.createElement("div");
            pic.classList.add("pic");
            let status = document.createElement("div");
            status.classList.add("status");
            let playerName = document.createElement("div");
            playerName.classList.add("name");
            playerName.textContent = e.name;
            let score = document.createElement("div");
            score.classList.add("score");
            score.textContent = `score: ${e.score}`;
            let next = document.createElement("div");
            next.classList.add("next");
            status.appendChild(playerName);
            status.appendChild(score);
            status.appendChild(next);
            card.appendChild(role);
            card.appendChild(pic);
            card.appendChild(status);
            left.appendChild(card);
        });
        // reset timer length
    });
    form.onsubmit = (e) => {
        e.preventDefault();
        socket.emit("chat message", `${name}: ${m.value}`);
        m.value = "";
        return false
    }
    socket.on("game started", () => {
        console.log("game started")
        nextOne.classList.remove("deactivated")
    });
    socket.on("pick one", (session) => {
        // render topic selection btns and start countdown
        let milsec = session.expired - Date.now();
        // picking topic countdown 10 sec
        timer = setTimeout(() => {
            socket.emit("player skipped");
        }, milsec);
        selectL.textContent = session.topic[0];
        selectR.textContent = session.topic[1];
        // display a short countdown
        countdown.style.transitionDuration = `${milsec/1000}s`;
        countdown.style.width = "0";
        // allow drawing in eventlistener function
        // send picked topic back to server
    });
    console.log(timer)
    socket.on("player skipped", (players) => {
        // assigned new drawer
    });
    socket.on("picking topic", (expired) => {
        let milsec = expired - Date.now();
        // display a short countdown
        countdown.style.transitionDuration = `${milsec/1000}s`;
        countdown.style.width = "0";
    });
    socket.on("drawer leaved", () => {
        // reset countdown width
        countdown.style.transitionDuration = "";
        countdown.style.width = "100%";
    });
    socket.on("chat message", (msg) => {
        const messages = document.querySelector("#messages");
        const text = document.createElement("div");
        text.textContent = msg;
        messages.appendChild(text);
        messages.scrollTop = messages.scrollHeight;
    });
    // canvas
    const canvas = document.querySelector(".whiteboard");
    // const colors = document.querySelector(".color");
    const ctx = canvas.getContext("2d");
    const frame = document.querySelector(".frame");
    // console.log("this is context.canvas", ctx.canvas);


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

    // for (let i = 0; i < colors.length; i++) { // colors
    //     colors[i].style.background = colors[i].className.split(" ")[1];
    //     colors[i].addEventListener("click", onColorUpdate, false);
    // }

    socket.on("drawing", onDrawingEvent); // listen for "drawing"

    window.addEventListener("resize", onResize, false);
    onResize();

    // equal to on connectcion
    socket.emit("canvas init", "newcomer requesting canvas data");
    // equal to on connectcion

    socket.on("canvas init", (msg) => {
        // console.log(msg)
        // only drawer can see this
        // grab the context from your destination canvas
        let png = canvas.toDataURL();
        // emit canvas data to server
        socket.emit("fresh canvas", png);
    });
    // recieve drawer canvas
    socket.on("fresh canvas", (data) => {
        // only newcomer will see this
        // console.log("fresh canvas revieced");
        let img = new Image();
        img.src = data;
        img.onload = function () {
            // *** img is created after window.onload ***
            // *** wait until img loaded then draw on canvas ***
            ctx.drawImage(img, 0, 0);
        }
        // img could be HTML Image, Video, Canvas Element
        // console.log("draw img on canvas");
    });

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
        // current.x = e.clientX - canvas.offsetLeft;
        // current.y = e.clientY - canvas.offsetTop;
        // frame element set to relative position and canvas left/top is referencing frame not body so canvas.offsets are 0 
        current.x = e.clientX - frame.offsetLeft;
        current.y = e.clientY - frame.offsetTop;
        drawLine(current.x, current.y, e.clientX - frame.offsetLeft, e.clientY - frame.offsetTop, current.color, true);
    }

    function onMouseUp() {
        // if (!drawing) {
        //     return;
        // }
        drawing = false;
    }

    function onMouseMove(e) {
        if (!drawing) {
            return;
        }
        drawLine(current.x, current.y, e.clientX - frame.offsetLeft, e.clientY - frame.offsetTop, current.color, true);
        current.x = e.clientX - frame.offsetLeft;
        current.y = e.clientY - frame.offsetTop;
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