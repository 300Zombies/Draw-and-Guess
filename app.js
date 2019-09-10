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
        this.drawing = true;
        // this.canvas = null;
    }
}
// let clients = [];
let currentCanvas;
let players = [];
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join room", (name) => {
        let i = players.findIndex((e) => { // e == elements
            return e.drawing === true;
        });

        // get canvas context
        players.push(new Player(name, socket.id));
        console.log(socket.id)
        console.log("players arr", players);
        socket
        io.emit("render player", players);
    });
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
        // let i = players.findIndex(e => e.id === socket.id);
        let i = players.findIndex((e) => { // e == elements
            return e.id === socket.id
        });
        players.splice(i, 1);
        io.emit("render player", players);
        console.log("indexof: ", i);
        console.log("players arr ", players);
    });
    socket.on("drawing", (data) => {
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