const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("./util/mysqlcon.js");
const server = app.listen(3000, () => {
    console.log("listening on port 3000");
});
const request = require("request");
const io = require("socket.io").listen(server);
const Game = require("./globalobj/obj.js").Game;
const Player = require("./globalobj/obj.js").Player;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

let game = new Game();
app.post("/login/facebook", (req, res) => {
    const fbToken = req.body.token;
    const url = `https://graph.facebook.com/me?fields=id,name,picture.width(160).height(160)&access_token=${fbToken}`;
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const fbName = JSON.parse(body).name;
            const fbPicture = JSON.parse(body).picture.data.url;
            res.json({
                name: fbName,
                picture: fbPicture
            });
        } else {
            console.log(error)
        }
    });
});
app.get("/knockknock", (req, res) => {
    // TODO: check if name duplicated
    if (game.players.length < 7) {
        res.send({
            message: `還有 ${7 - game.players.length} 個位置`
        });
    } else {
        res.send({
            message: "沒有位置了"
        });
    }
});
io.on("connection", (socket) => {
    socket.on("join room", (player) => {
        game.add(new Player(player.name, player.picture, socket.id));
        let i = game.players.findIndex((e) => {
            return e.drawing === true
        });
        if (i === -1) {
            game.players[0].drawing = true;
            socket.emit("show game start");
        } else {
            socket.emit("show wait for start");
        }
        // if game.on === true do synchronize canvas and timebar
        // socket.emit("synchronize canvas"); // TODO:
        // socket.emit("synchronize timebar"); // TODO:
        io.emit("render players", game.players);
    });
    socket.on("chat message", (player) => {
        let msg;
        let i = game.players.findIndex((e) => {
            return e.id === socket.id
        });
        if (player.answer === game.topic) {
            // msg = `${player.name}: 猜對了!!`;
            // let i = game.players.findIndex((e) => {
            //     return e.id === socket.id
            // });
            msg = `${game.players[i].name}: 猜對了!!`;
            game.players[i].score += 35;
            socket.emit("disable chat");
            io.emit("render players", game.players);
            game.guessed += 1;
            let result = game.players.filter((player) => {
                return player.score >= 100;
            });
            if (result.length > 0) {
                game.finished = true;
                game.winner = result.reduce((prev, curr) => { // Ted
                    return prev.score > curr.score ? prev : curr
                });
            }
            if (game.guessed === game.players.length - 1) {
                clearTimeout(game.timer);
                let i = game.players.findIndex((e) => {
                    return e.drawing === true;
                });
                game.players[i].drawing = false;
                i = i + 1 === game.players.length ? 0 : i + 1;
                game.players[i].drawing = true;
                game.next = game.players[i];
                io.to(game.players[i].id).emit("time up");
                let expired = Date.now() + (10 * 1000);
                io.emit("frontend timer", expired);
                io.emit("disable canvas");
                io.emit("disable chat");
                io.emit("hide canvas panel");
                io.emit("masterpiece", game.next);
                game.guessed = 0;
            }
        } else {
            msg = `${game.players[i].name}: ${player.answer}`;
        }
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        let i = game.players.findIndex((e) => {
            return e.id === socket.id
        });
        console.log("all", game.players)
        // console.log("i", game.players[i])
        if (game.players[i].drawing === true) {
            game.curr = game.players[i];
            clearTimeout(game.timer);
            i = i + 1 === game.players.length ? 0 : i + 1;
            game.players[i].drawing = true;
            game.next = game.players[i];
            io.to(game.players[i].id).emit("time up");
            let expired = Date.now() + (10 * 1000);
            io.emit("frontend timer", expired);
            io.emit("disable canvas");
            io.emit("disable chat")
            io.emit("hide canvas panel");
            io.emit("player skipped", {
                curr: game.curr,
                next: game.next
            });
            i = i - 1 === -1 ? game.players.length - 1 : i - 1;
        }
        // i = i - 1 === -1 ? game.players.length - 1 : i - 1;
        console.log("spliced i", i)
        game.players.splice(i, 1);
        // if (game.players.length === 0) {
        //     game.on = false;
        // }
        io.emit("render players", game.players);
    });
    socket.on("canvas init", () => { // TODO: combine to on connection
        let i = game.players.findIndex((e) => {
            return e.drawing === true;
        });
        io.to(game.players[i].id).emit("canvas init");
    });
    socket.on("fresh canvas", (img) => { //  TODO: under construction
        io.to(game.players[game.players.length - 1].id).emit("fresh canvas", img);
    });
    socket.on("drawing", (data) => {
        socket.broadcast.emit("drawing", data);
    });
    socket.on("clear canvas", () => {
        socket.broadcast.emit("clear canvas");
    });
    socket.on("game start", async () => {
        if (game.topicPool.length <= 2) {
            // game.on = true; // TODO: wrong logic
            game.guessed = 0;
            game.topicPool = await mysql.con(`select title from animals`);
            game.topicPool = game.topicPool.map((e) => {
                return e.title
            });
            game.shuffle(game.topicPool);
        }
        let topic = game.topicPair(game.topicPool);
        let expired = Date.now() + (10 * 1000);
        socket.emit("disable chat");
        socket.emit("pick one", topic);
        io.emit("frontend timer", expired);
    });
    socket.on("pick 10 sec", () => {
        game.guessed = 0;
        game.countdown(10 * 1000, () => {
            let i = game.players.findIndex((e) => {
                return e.drawing === true;
            });
            game.curr = game.players[i];
            game.players[i].drawing = false;
            i = i + 1 === game.players.length ? 0 : i + 1;
            game.players[i].drawing = true;
            io.to(game.players[i].id).emit("time up");
            game.next = game.players[i];
            let expired = Date.now() + (10 * 1000);
            io.emit("player skipped", {
                curr: game.curr,
                next: game.next
            });
            io.emit("frontend timer", expired);
        });
    });
    socket.on("topic picked", (theTopic) => {
        clearTimeout(game.timer);
        game.topic = theTopic;
        let expired = Date.now() + (60 * 1000);
        socket.emit("start drawing", expired);
        socket.emit("show canvas panel");
        socket.broadcast.emit("start guessing", expired);
        io.emit("frontend timer", expired);
    });
    socket.on("wait 10 sec", () => {
        if (game.finished) {
            game.players.forEach((e) => {
                e.score = 0;
            });
            game.finished = false;
            game.countdown(10 * 1000, () => {
                let expired = Date.now() + (10 * 1000);
                io.emit("winner", {
                    next: game.next,
                    winner: game.winner
                });
                io.emit("render players", game.players)
                io.emit("frontend timer", expired);
                socket.emit("time up");
            });
        } else {
            game.countdown(10 * 1000, () => {
                socket.emit("round end");
                socket.broadcast.emit("guess end");
            });
        }
    });
    socket.on("draw 60 sec", () => {
        game.countdown(60 * 1000, () => { // start drawing countdown
            let i = game.players.findIndex((e) => {
                return e.drawing === true;
            });
            game.players[i].drawing = false;
            i = i + 1 === game.players.length ? 0 : i + 1;
            game.players[i].drawing = true;
            game.next = game.players[i];
            io.to(game.players[i].id).emit("time up");
            let expired = Date.now() + (10 * 1000);
            io.emit("frontend timer", expired);
            io.emit("show answer", {
                next: game.next,
                topic: game.topic
            });
            io.emit("disable canvas");
            io.emit("disable chat")
            io.emit("hide canvas panel");
        });
    });
});