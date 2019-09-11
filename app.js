const express = require("express");
const app = express();
const bodyParser = require("body-parser");
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
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join room", (name) => {
        players.push(new Player(name, socket.id));
        if (players.length === 1) {
            players[0].drawing = true; // first player === default drawer
        }
        console.log("players", players);
        io.emit("render player", players);
    });
    socket.on("chat message", (msg) => {
        // emit to all sockets including event sender
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
        // let i = players.findIndex(e => e.id === socket.id);
        let i = players.findIndex((e) => { // e === elements
            return e.id === socket.id
        });
        players.splice(i, 1);
        io.emit("render player", players);
        console.log("players", players);
    });
    // canvas sync
    socket.on("canvas init", (msg) => {
        console.log(msg)
        // find current drawer
        let i = players.findIndex((e) => {
            return e.drawing === true;
        });
        console.log("current drawer socket id =", players[i].id);
        // send to current drawer
        io.to(players[i].id).emit("canvas init", "server resquesting canvas data");
    });
    socket.on("fresh canvas", (png) => {
        console.log("socket.id request canvas", players[players.length - 1].id)
        // send to newcomer
        io.to(players[players.length - 1].id).emit("fresh canvas", png);
    });
    socket.on("drawing", (data) => {
        // emit to all socket BUT event sender
        socket.broadcast.emit("drawing", data);
    });
});

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