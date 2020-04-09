/// <reference path="../../../p5.global-mode.d.ts" />
/// <reference path="../../../socket.io.d.ts" />
/// <reference path="../game.ts" />


interface GameDataPacket {
	gameId: number,
		gameType: number,
		gameToken: string,
		packetType: string,
		userName ? : string,
		userToken ? : string,
		data ? : any
}

interface Game {
	gameId: number,
		gameType: number,
		gameName: string,
		gameToken: string,
}

_socket.on("welcome", data => {
	console.log("starting game");
	new backgammon(_socket);
})

class backgammon extends p5 {

	constructor(socket: SocketIO.Socket) {
		super(() => {}, document.getElementById("game"), false);
	}

	setup() {
		this.createCanvas(1000, 600);
	}

	draw() {
		this.background(this.color("brown"));
	}

}