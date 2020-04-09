/// <reference path="../../../p5.global-mode.d.ts" />
/// <reference path="../../../socket.io.d.ts" />
/// <reference path="../game.ts" />
_socket.on("welcome", data => {
    console.log("starting game");
    new backgammon(_socket);
});
class backgammon extends p5 {
    constructor(socket) {
        super(() => { }, document.getElementById("game"), false);
    }
    setup() {
        this.createCanvas(1000, 600);
    }
    draw() {
        this.background(this.color("brown"));
    }
}
//# sourceMappingURL=game.js.map