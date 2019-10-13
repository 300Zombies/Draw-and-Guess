let game = require("./app.js");
let mysql = require("./util/mysqlcon");
let Player = require("./app.js");
console.log(game)
console.log(Player)

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