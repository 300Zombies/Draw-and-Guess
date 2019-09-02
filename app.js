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

// io.on("connection", (socket) => { // message synchronous
//     console.log("a user connected");
//     socket.on("chat message", function (msg) {
//         io.emit("chat message", msg);
//     });
//     socket.on("disconnect", () => {
//         console.log("user disconnected");
//     });
// });

function onConnection(socket) {
    // message synchronous
    socket.on("chat message", function (msg) {
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    // canvas synchronous
    socket.on("drawing", (data) => {
        socket.broadcast.emit("drawing", data)
    });
}

io.on("connection", onConnection);