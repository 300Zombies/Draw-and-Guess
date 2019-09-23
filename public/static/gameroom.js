// "use strict";
window.addEventListener("load", () => { // change jQuery back to vanilla JavaScript
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
    const sendBtn = document.querySelector(".send");
    // TODO: game start btn
    // canvas
    const canvas = document.querySelector(".whiteboard");
    // const colors = document.querySelector(".color");
    const ctx = canvas.getContext("2d");
    const frame = document.querySelector(".frame");
    // console.log("this is context.canvas", ctx.canvas);

    btnY.addEventListener("click", () => {
        // theoretically start game event should emit only once per game
        socket.emit("game start");
        socket.emit("pick 10 sec");
        headline.className = "";
        headline.textContent = "";
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
    // TODO: only drawer has topic selection event
    selectBtns.forEach((e) => {
        e.addEventListener("click", function () {
            // drawer picked topic and send to server
            socket.emit("topic picked", this.textContent);
            socket.emit("draw 60 sec"); // timer
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
    socket.on("render player", (gameStatus) => {
        console.log("My socket.id =", socket.id);
        let players = gameStatus.players;
        // show everyone's socket.id when joined
        let i = players.findIndex((e) => { // e === elements
            return e.id === socket.id
        });
        // prepare drawer screen
        if (i === 0) {
            // something went wrong here
            // players[0] not always drawer
            console.log("I'm da host!")
            headline.className = "";
            headline.classList.add("start-h1")
            infoBtns.forEach((e) => {
                e.classList.remove("deactivated")
            });
        } else {
            console.log("I'm not da host!");
        }
        nextOne.classList.add("deactivated");
        // prepare drawer screen
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
        // if game in progress TODO:
        if (gameStatus.on) {
            // do canvas init
            socket.emit("canvas init", "newcomer requesting canvas data");
        }
    });
    socket.on("update score", (players) => {
        left.innerHTML = "";
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
    });
    form.onsubmit = (e) => {
        e.preventDefault();
        // socket.name = name;
        // socket.emit("chat message", `${name}: ${m.value}`);
        socket.emit("chat message", {
            name: name,
            answer: m.value,
            id: socket.id
        });
        m.value = "";
        return false
    }
    socket.on("pick one", (topic) => {
        // drawer only event
        info.classList.remove("deactivated");
        headline.textContent = "";
        headline.className = "";
        headline.classList.add("select-h1");
        panel.classList.remove("deactivated");
        infoBtns.forEach((e) => {
            e.classList.add("deactivated");
        });
        selectBtns.forEach((e) => {
            e.classList.remove("deactivated");
        });
        nextOne.classList.add("deactivated");
        selectL.textContent = topic[0];
        selectR.textContent = topic[1];
    });
    socket.on("player skipped", (player) => {
        info.classList.remove("deactivated");
        headline.className = "";
        headline.classList.add("skipped-h1");
        headline.textContent = "";
        headline.textContent = player.last.name;
        panel.classList.add("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = "";
        nextOne.textContent = `${player.next.name} is next`;
    });
    socket.on("time up", () => { // next drawer only
        // status === undefined if no value
        socket.emit("wait 10 sec");
    });
    socket.on("block canvas and chat", () => {
        barrier.classList.remove("deactivated");
        m.value = "";
        m.disabled = true;
        sendBtn.disabled = true;
    });
    // *** timer event ***
    socket.on("frontend timer", (expired) => {
        // everyone gets the countdown
        // let sec = (expired - Date.now()) / 1000;
        let sec = ((expired - Date.now()) / 1000) + 3;
        timerBox.removeChild(countdown);
        timerBox.appendChild(countdown);
        countdown.style.animation = `timebar ${sec}s linear`;
        console.log(`frontend countdown ${sec}s`);
    });
    socket.on("drawer leaved", () => {
        // reset countdown width
        // countdown.style.transitionDuration = "";
        // countdown.style.width = "100%";
        // resetTimeBar();
    });
    socket.on("round end", () => {
        // drawer recieved round end
        socket.emit("round start");
        socket.emit("pick 10 sec");
        // show wait title

        headline.className = "";
        headline.classList.add("wait-h1");
        headline.textContent = "";
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        // nextOne.textContent = `player is next`;
        nextOne.textContent = "";
        m.diabled = true;
        sendBtn.disable = true;
    });
    socket.on("guess end", () => { // guessing person only
        headline.className = "";
        headline.classList.add("wait-h1");
        headline.textContent = "";
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = "";
        // nextOne.textContent = `player is next`;
        m.diabled = true;
        sendBtn.disable = true;
    })
    socket.on("start guessing", () => {
        // control player frontend element
        console.log("start guessing")
        info.classList.add("deactivated");
        sendBtn.disabled = false;
        m.disabled = false;
        infoBtns.forEach((e) => {
            e.classList.add("deactivated");
        });
        selectBtns.forEach((e) => {
            e.classList.add("deactivated");
        });
    });
    socket.on("start drawing", () => {
        // control drawer frontend element
        countdown.classList.add("running");
        console.log("im drawing!");
        // disable canvas barrier and info
        barrier.classList.add("deactivated");
        info.classList.add("deactivated");
        infoBtns.forEach((e) => {
            e.classList.add("deactivated");
        });
        selectBtns.forEach((e) => {
            e.classList.add("deactivated");
        });
        // countdown moved to timer event
    });
    socket.on("you hit", () => {
        // disable chat
        console.log("you hit");
        m.disabled = true;
        sendBtn.disabled = true;
    });
    socket.on("masterpiece", (player) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        headline.className = "";
        headline.classList.add("master-h1");
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = `${player.name} is next`;
        m.diabled = true;
        sendBtn.disable = true;
    });
    socket.on("show answer", (data) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        headline.className = "";
        headline.textContent = "";
        headline.classList.add("answer-h1");
        headline.textContent = data.topic;
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = `${data.next.name} is next`;
        // reset timeBar, start topic picking
        m.diabled = true;
        sendBtn.disable = true;
        console.log(`answer is ${data.topic}`);
    });
    socket.on("winner", (player) => { // TODO: pass variable
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        headline.textContent = "";
        headline.textContent = ` ${player.winner.name}`;
        headline.className = "";
        headline.classList.add("winner-h1");
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = `${player.next.name} is next`;
        // reset timeBar, start topic picking
        m.diabled = true;
        sendBtn.disable = true;
        // console.log(`winner is ${winner}`);
    });
    socket.on("chat message", (msg) => {
        const messages = document.querySelector("#messages");
        const text = document.createElement("div");
        text.textContent = msg;
        messages.appendChild(text);
        messages.scrollTop = messages.scrollHeight;
    });
    // canvas
    // const canvas = document.querySelector(".whiteboard");
    // const colors = document.querySelector(".color");
    // const ctx = canvas.getContext("2d");
    // const frame = document.querySelector(".frame");
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