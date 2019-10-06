window.addEventListener("load", () => { // change jQuery back to vanilla JavaScript
    const countdown = document.querySelector(".countdown");
    const timerBox = document.querySelector(".timer-box");
    const info = document.querySelector(".info");
    const panel = document.querySelector(".info-panel");
    const headline = document.querySelector(".info-header h1")
    const btnY = document.querySelector(".info-yes");
    const btnN = document.querySelector(".info-no");
    const infoBtns = document.querySelectorAll(".info-btn");
    const selectL = document.querySelector(".select-left");
    const selectR = document.querySelector(".select-right");
    const selectBtns = document.querySelectorAll(".select-btn");
    const nextOne = document.querySelector(".next-one");
    const barrier = document.querySelector(".barrier");
    const sendBtn = document.querySelector(".send");
    const cards = document.querySelectorAll(".card");
    const canvas = document.querySelector(".whiteboard");
    const colors = document.querySelectorAll(".color");
    const clearAll = document.querySelector(".clear");
    const canvasPanel = document.querySelector(".canvas-panel");
    const ctx = canvas.getContext("2d");
    const frame = document.querySelector(".frame");
    btnY.addEventListener("click", () => {
        socket.emit("game start");
        socket.emit("pick 10 sec");
        headline.className = "";
        headline.textContent = "";
        headline.classList.add("select-h1");
        infoBtns.forEach((e) => {
            e.classList.add("deactivated");
        });
        selectBtns.forEach((e) => {
            e.classList.remove("deactivated");
        });
    });
    selectBtns.forEach((e) => {
        e.addEventListener("click", function () {
            socket.emit("topic picked", this.textContent);
            socket.emit("draw 60 sec");
        });
    });
    const socket = io();
    const form = document.querySelector("form");
    const m = document.querySelector("#m");
    const name = (sessionStorage.getItem("nickname")).toString();
    const picture = sessionStorage.getItem("portrait");
    socket.emit("join room", {
        name: name,
        picture: picture
    });
    socket.on("show game start", () => {
        info.classList.remove("deactivated");
        headline.className = "start-h1";
        infoBtns.forEach((e) => {
            e.classList.remove("deactivated")
        });
    });
    socket.on("show wait for start", () => {
        info.classList.remove("deactivated");
        headline.className = "wait-h1";
        // TODO: show apng
    });
    socket.emit("canvas init", "newcomer requesting canvas data");
    // socket.on("synchronize canvas re", () => {
    // get current drawer canvas
    // });
    socket.on("render players", (players) => {
        cards.forEach((e) => {
            e.innerHTML = "";
        });
        for (let i = 0; i < players.length; i++) {
            let role = document.createElement("div");
            role.classList.add("role");
            let pic = document.createElement("div");
            pic.classList.add("pic");
            pic.style.backgroundSize = "cover";
            pic.style.backgroundImage = players[i].picture;
            let status = document.createElement("div");
            status.classList.add("status");
            let playerName = document.createElement("div");
            playerName.classList.add("name");
            playerName.textContent = `id: ${players[i].name}`;
            let score = document.createElement("div");
            score.classList.add("score");
            score.textContent = `pts: ${players[i].score}`;
            status.appendChild(playerName);
            status.appendChild(score);
            cards[i].appendChild(role);
            cards[i].appendChild(pic);
            cards[i].appendChild(status);
        }
    });
    form.onsubmit = (e) => {
        e.preventDefault();
        socket.emit("chat message", {
            name: name,
            answer: m.value,
            id: socket.id
        });
        m.value = "";
        return false
    }
    socket.on("pick one", (topic) => {
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        info.classList.remove("deactivated");
        headline.className = "";
        headline.classList.add("skipped-h1");
        headline.textContent = "";
        headline.textContent = player.curr.name;
        panel.classList.add("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = "";
        nextOne.textContent = `下一個是 ${player.next.name}`;
    });
    socket.on("time up", () => {
        socket.emit("wait 10 sec");
    });
    socket.on("disable canvas", () => {
        barrier.classList.remove("deactivated");
    })
    socket.on("disable chat", () => {
        m.value = "";
        m.disabled = true;
        sendBtn.disabled = true;
    });
    // *** timer event *** //
    socket.on("frontend timer", (expired) => {
        let sec = ((expired - Date.now()) / 1000) + 0.5;
        timerBox.removeChild(countdown);
        timerBox.appendChild(countdown);
        countdown.style.animation = `timebar ${sec}s linear`;
        console.log(`frontend countdown ${sec}s`);
    });
    socket.on("round end", () => {
        socket.emit("game start");
        socket.emit("pick 10 sec");
        headline.className = "";
        headline.classList.add("wait-h1");
        headline.textContent = "";
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = "";
        m.diabled = true;
        sendBtn.disable = true;
    });
    socket.on("guess end", () => {
        headline.className = "";
        headline.classList.add("wait-h1");
        headline.textContent = "";
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = "";
        m.diabled = true;
        sendBtn.disable = true;
    })
    socket.on("start guessing", () => {
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
        current.color = "#ffffff";
        countdown.classList.add("running");
        console.log("im drawing!");
        barrier.classList.add("deactivated");
        info.classList.add("deactivated");
        infoBtns.forEach((e) => {
            e.classList.add("deactivated");
        });
        selectBtns.forEach((e) => {
            e.classList.add("deactivated");
        });
    });
    socket.on("clear canvas", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    socket.on("show canvas panel", () => {
        canvasPanel.classList.remove("deactivated");
    });
    socket.on("hide canvas panel", () => {
        canvasPanel.classList.add("deactivated");
    })
    socket.on("disable chat", () => {
        m.disabled = true;
        sendBtn.disabled = true;
    });
    socket.on("masterpiece", (player) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        headline.className = "";
        headline.classList.add("master-h1");
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = `下一個是 ${player.name}`;
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
        nextOne.textContent = `下一個是 ${data.next.name}`;
        m.diabled = true;
        sendBtn.disable = true;
        console.log(`answer is ${data.topic}`);
    });
    socket.on("winner", (player) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        headline.textContent = "";
        headline.textContent = `${player.winner.name} !`;
        headline.className = "";
        headline.classList.add("winner-h1");
        info.classList.remove("deactivated");
        nextOne.classList.remove("deactivated");
        nextOne.textContent = `下一個是 ${player.next.name}`;
        m.diabled = true;
        sendBtn.disable = true;
    });
    socket.on("chat message", (msg) => {
        const messages = document.querySelector("#messages");
        const text = document.createElement("div");
        text.textContent = msg;
        messages.appendChild(text);
        messages.scrollTop = messages.scrollHeight;
    });
    let current = {
        color: "#fff",
    };
    let drawing = false;
    colors.forEach((e) => {
        e.addEventListener("click", () => {
            current.color = window.getComputedStyle(e).getPropertyValue("background-color");
        });
    });
    clearAll.addEventListener("click", () => {
        socket.emit("clear canvas");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseUp, false);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);
    canvas.addEventListener("touchstart", onMouseDown, false);
    canvas.addEventListener("touchend", onMouseUp, false);
    canvas.addEventListener("touchcancel", onMouseUp, false);
    canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);
    socket.on("drawing", onDrawingEvent);
    window.addEventListener("resize", onResize, false);
    onResize();
    socket.on("canvas init", () => {
        let png = canvas.toDataURL();
        socket.emit("fresh canvas", png);
    });
    socket.on("fresh canvas", (data) => { // guessing
        let img = new Image();
        img.src = data;
        img.onload = function () {
            // *** img is created after window.onload *** //
            // *** wait until img loaded then draw on canvas *** //
            ctx.drawImage(img, 0, 0);
        }
        // *** img could be HTML Image, Video, Canvas Element ***//
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
        socket.emit("drawing", { // drawing
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

    function throttle(callback, delay) { // limit the number of events per second
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

    function onResize() { // make the canvas fill its parent
        canvas.width = frame.offsetWidth;
        canvas.height = frame.offsetHeight;
    }
});