// $(function () {
//     var socket = io();
//     $("form").submit(function (e) {
//         e.preventDefault(); // prevents page reloading
//         socket.emit("chat message", $("#m").val());
//         $("#m").val("");
//         return false;
//     });
//     socket.on("chat message", (msg) => {
//         $("#messages").append($("<li>").text(msg));
//     });
// });

window.addEventListener("load", () => { // change jQuery back to vanilla JavaScript
    const socket = io();
    const form = document.querySelector("form");
    const m = document.querySelector("#m");
    const name = sessionStorage.getItem("name");
    sessionStorage.removeItem("name");
    form.onsubmit = (e) => {
        e.preventDefault();
        socket.emit("chat message", m.value);
        m.value = "";
        return false
    }
    socket.on("chat message", (msg) => {
        const message = document.querySelector("#messages");
        const list = document.createElement("li");
        list.textContent = `${name}: ${msg}`;
        message.appendChild(list);
    });
});