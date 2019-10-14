let app = require("./app.js");
let mysql = require("./util/mysqlcon");
let game = app.game;
let Player = app.player;
test("test database query", async () => {
    game.topicPool = await mysql.con(`select title from animals`);
    game.topicPool = game.topicPool.map((e) => {
        return e.title
    });
    game.shuffle(game.topicPool);
    let topic = game.topicPair(game.topicPool);
    expect(topic).not.toBeUndefined();
    expect(topic.length).toBeGreaterThan(0);
    expect(topic.length).toBe(2);
});
test("test player array", () => {
    game.add(new Player("Jest", "", ""));
    expect(typeof game.players).toBe("object");
    expect(game.players.length).toBeGreaterThan(0);
    expect(game.players[0].name).toBe("Jest");
});

// jest.useFakeTimers(); for global use
test("timer function test", () => {
    jest.useFakeTimers();
    game.countdown(1000, () => {
        console.log("time up")
    });
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});