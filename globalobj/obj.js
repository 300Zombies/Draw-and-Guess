class Game {
    constructor() {
        this.on = false;
        this.players = [];
        this.curr = "";
        this.next = "";
        this.winner = "";
        this.topicPool = [];
        this.topic = "";
        this.timer = "";
        this.interval = "";
        this.guessed = 0;
        this.now = 0;
        this.finished = false;
    }
    add(player) {
        if (player.name === "") {
            player.name = "Anonymous";
            player.picture = `url("../img/anonymous-250.jpg")`;
        }
        this.players.push(player)
    }
    shuffle(arr) { // The Fisher–Yates shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    topicPair(arr) {
        let topic = arr.splice(0, 2);
        return topic
    }
    countdown(milsec, cb) {
        // this.interval = setInterval(() => {
        //     game.now++;
        // }, 1000);
        this.timer = setTimeout(() => {
            cb();
        }, milsec);
    }
}
class Player { // player object
    constructor(name, picture, id) {
        this.name = name;
        this.id = id;
        this.score = 0;
        this.drawing = false;
        this.picture = picture;
    }
}
module.exports = {
    Game: Game,
    Player: Player
}