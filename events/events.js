module.exports = function get(game) {
    let i = game.players.findIndex((e) => {
        return e.drawing === true;
    });
}