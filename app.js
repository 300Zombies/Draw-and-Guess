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

io.on("connection", (socket) => { // message synchronous
    console.log("a user connected");
    socket.on("chat message", function (msg) {
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    socket.on("drawing", (data) => {
        socket.broadcast.emit("drawing", data);
    });
});