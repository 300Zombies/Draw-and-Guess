const play = document.querySelector("#play");
const nickname = document.querySelector("#nameInput");
play.addEventListener("mousedown", () => {
    sessionStorage.setItem("name", nickname.value);
    window.location.href = "/gameroom.html";
});