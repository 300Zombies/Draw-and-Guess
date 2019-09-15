const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("./util/mysqlcon.js");
const server = app.listen(3000, () => {
    console.log("listening on port 3000");
});
const io = require("socket.io").listen(server);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ // urlencoded is <form>'s default data type
    extended: false
}));
app.use(bodyParser.json()); // now body-parser can parse <form>'s json

// io.on('connection', function(socket){
//     socket.emit('request', /* */); // emit an event to the socket
//     io.emit('broadcast', /* */); // emit an event to all connected sockets
//     socket.on('reply', function(){ /* */ }); // listen to the event
//   });

// game object
class Game {
    constructor() {
        this.on = false;
        this.players = [];
        this.topicPool = [];
    }
    add(player) {
        this.players.push(player)
    }
    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    topic(arr) {
        let topic = arr.splice(0, 2);
        return topic
    }
}
// player object
class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.score = 0;
        this.drawing = false;
    }
}
let players = [];
let game = new Game();
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join room", (name) => {
        // build game object
        // check if name duplicated
        // push players
        game.players.push(new Player(name, socket.id));
        if (game.players.length === 1) {
            game.players[0].drawing = true; // first player === default drawer
        }
        console.log("game object", game);
        // pass latest players to front-end
        io.emit("render player", game.players);
    });
    socket.on("chat message", (msg) => {
        // emit to all sockets including event sender
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        // player disconnect while game started, especially drawing persion
        console.log("user disconnected");
        // let i = players.findIndex(e => e.id === socket.id);
        let i = game.players.findIndex((e) => { // e === elements
            return e.id === socket.id
        });
        // update players and drawing status
        if (game.players[i].drawing === true) {
            // handle drawing person leave
            io.emit("drawer leaved");
            if (i + 1 === game.players.length) {
                game.players[0].drawing = true;
            } else {
                game.players[i + 1].drawing = true;
            }
        }
        game.players.splice(i, 1);
        // send to everyone
        console.log(game.players)
        io.emit("render player", game.players);
        // prevent error
    });
    // canvas sync
    socket.on("canvas init", (msg) => {
        console.log(msg)
        // find current drawer
        let i = game.players.findIndex((e) => {
            return e.drawing === true;
        });
        console.log("current drawer socket id =", game.players[i].id);
        // send to current drawer
        io.to(game.players[i].id).emit("canvas init", "server resquesting canvas data");
    });
    socket.on("fresh canvas", (img) => {
        console.log("socket.id request canvas", game.players[game.players.length - 1].id)
        // send to newcomer
        io.to(game.players[game.players.length - 1].id).emit("fresh canvas", img);
    });
    socket.on("drawing", (data) => {
        // emit to all socket BUT event sender
        socket.broadcast.emit("drawing", data);
    });
    socket.on("game start", async (msg) => {
        // game on!
        game.on = true;
        // get topics from database
        game.topicPool = await mysql.con(`select title from animals`);
        // map pool
        game.topicPool = game.topicPool.map((e) => {
            return e.title
        });
        game.shuffle(game.topicPool)
        console.log(msg)
        let session = {
            topic: game.topic(game.topicPool),
            expired: Date.now() + (10 * 1000)
        }
        console.log(session)
        // emit two topics and expired time to drawing person
        socket.emit("pick one", session);
        // emit expired time to others
        socket.broadcast.emit("picking topic", session.expired);
        // start a short countdown to picking/waiting topic selection

        // console.log(Date.now())
        // quiz = {
        //     topic: topic,
        //     timeup: Date.now() + (10 * 1000)
        // }
        // socket.broadcast.emit("game started", quiz)
        // setTimeout(() => {

        // }, timeout);
    });
    socket.on("player skipped", () => {
        // round start
        // next one pick topics
        console.log(socket.id, "has skipped the turn");
        let i = game.players.findIndex((e) => {
            return e.drawing === true;
        });
        // assign new drawer
        if (i + 1 === game.players.length) {
            game.players[0].drawing = true;
        } else {
            game.players[i + 1].drawing = true;
        }
        // io.emit("round start", game.players);
    });
    socket.on("round start", (theTopic) => {
        // topic picked
        console.log(theTopic)
        // use this to verify if there's answer in chat msg
    })
});
// The Fisher–Yates shuffle
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function stepOne(timeout) {
    console.log("step 1")
    setTimeout(() => {
        stepTwo(1000)
    }, timeout);
}

function stepTwo(timeout) {
    console.log("step 2")
    setTimeout(() => {
        stepThree(1000)
    }, timeout);
}

function stepThree(timeout) {
    console.log("step 3")
    setTimeout(() => {
        stepOne(1000)
    }, timeout);
}
let cdl = 0

function countdownLoop(ms, cb) {
    setTimeout(() => {
        console.log(cdl)
        cdl++
        cb(ms, cb)
    }, ms)
}
// countdownLoop(1000, countdownLoop)
// testchat

// var numUsers = 0;

// io.on('connection', (socket) => {
//     var addedUser = false;

//     // when the client emits 'new message', this listens and executes
//     socket.on('new message', (data) => {
//         // we tell the client to execute 'new message'
//         socket.broadcast.emit('new message', {
//             username: socket.username,
//             message: data
//         });
//     });

//     // when the client emits 'add user', this listens and executes
//     socket.on('add user', (username) => {
//         if (addedUser) return;

//         // we store the username in the socket session for this client
//         socket.username = username;
//         ++numUsers;
//         addedUser = true;
//         socket.emit('login', {
//             numUsers: numUsers
//         });
//         // echo globally (all clients) that a person has connected
//         socket.broadcast.emit('user joined', {
//             username: socket.username,
//             numUsers: numUsers
//         });
//     });

//     // when the client emits 'typing', we broadcast it to others
//     socket.on('typing', () => {
//         socket.broadcast.emit('typing', {
//             username: socket.username
//         });
//     });

//     // when the client emits 'stop typing', we broadcast it to others
//     socket.on('stop typing', () => {
//         socket.broadcast.emit('stop typing', {
//             username: socket.username
//         });
//     });

//     // when the user disconnects.. perform this
//     socket.on('disconnect', () => {
//         if (addedUser) {
//             --numUsers;

//             // echo globally that this client has left
//             socket.broadcast.emit('user left', {
//                 username: socket.username,
//                 numUsers: numUsers
//             });
//         }
//     });
// });