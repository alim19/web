// / <reference path="../.. / .. / socket.io.d.ts "/>
/// <reference path="../../../p5.global-mode.d.ts" />
const cookies = document.cookie
    .split(';')
    .reduce((res, c) => {
    const [key, val] = c.trim().split('=').map(decodeURIComponent);
    try {
        return Object.assign(res, {
            [key]: JSON.parse(val)
        });
    }
    catch (e) {
        return Object.assign(res, {
            [key]: val
        });
    }
}, {});
const URLParams = new window.URLSearchParams(window.location.search);
//@ts-ignore
const _socket = io();
let joinParams = {
    gameId: URLParams.get("id"),
    userName: cookies.username,
    gamePassword: cookies.game_password,
};
_socket.emit("join", joinParams);
_socket.on("kick", (reason) => {
    console.log(reason);
    window.location.href = "./";
});
_socket.on("welcome", (message) => {
    console.log(message);
    new defend(_socket);
});
onbeforeunload = () => {
    _socket.emit("leave");
};
var rotation;
(function (rotation) {
    rotation["NORTH"] = "north";
    rotation["EAST"] = "east";
    rotation["SOUTH"] = "south";
    rotation["WEST"] = "west";
})(rotation || (rotation = {}));
class base extends p5 {
    constructor(socket, params) {
        super(() => { }, params);
        this.placed_ships = [];
        this.shots = [];
        this.x = 10;
        this.y = 10;
        this.socket = socket;
    }
    draw() {
        let w = this.width / this.x;
        let h = this.height / this.y;
        this.background(100);
        //draw ships
        let X = this.floor(this.mouseX / w);
        let Y = this.floor(this.mouseY / h);
        this.fill(0, 255, 0);
        for (let ship of this.placed_ships) {
            this.drawShip(ship);
        }
        this.fill(255, 255, 255);
        if (this.placing) {
            if (X >= 0 && X < 10 &&
                Y >= 0 && Y < 10) {
                this.placing.x = X;
                this.placing.y = Y;
            }
            if (!this.checkShip(this.placing))
                this.fill(255, 0, 0);
            this.drawShip(this.placing);
        }
        //draw shots
        for (let shot of this.shots) {
            this.stroke(0, 255, 0);
            this.drawShot(shot);
        }
        this.stroke(255, 255, 255);
        if (this.firing) {
            if (X >= 0 && X < 10 &&
                Y >= 0 && Y < 10) {
                this.firing.x = X;
                this.firing.y = Y;
            }
            this.drawShot(this.firing);
        }
        //draw grid
        this.drawGrid();
    }
    drawGrid() {
        this.strokeWeight(5);
        this.stroke(0, 0, 0);
        for (let i = 0; i <= this.x; i++) {
            this.line(i * this.width / this.x, 0, i * this.width / this.x, this.height);
        }
        for (let i = 0; i <= this.y; i++) {
            this.line(0, i * this.height / this.y, this.width, i * this.height / this.y);
        }
    }
    drawShip(ship) {
        let w = this.width / this.x;
        let h = this.height / this.y;
        let xCentreStart = (ship.x + 0.5) * w;
        let yCentreStart = (ship.y + 0.5) * h;
        let xCentreEnd, yCentreEnd;
        xCentreEnd = xCentreStart;
        yCentreEnd = yCentreStart;
        switch (ship.rotation) {
            case "north":
                yCentreEnd -= (ship.size - 1) * h;
                break;
            case "east":
                xCentreEnd += (ship.size - 1) * w;
                break;
            case "south":
                yCentreEnd += (ship.size - 1) * h;
                break;
            case "west":
                xCentreEnd -= (ship.size - 1) * w;
                break;
        }
        // fill(255);
        this.noStroke();
        let r = w - 10;
        this.ellipse(xCentreStart, yCentreStart, r);
        this.ellipse(xCentreEnd, yCentreEnd, r);
        this.rectMode(this.CENTER);
        this.rect((xCentreStart + xCentreEnd) / 2, (yCentreStart + yCentreEnd) / 2, this.abs(xCentreEnd - xCentreStart) + (ship.rotation == "north" || ship.rotation == "south" ? r : 0), this.abs(yCentreEnd - yCentreStart) + (ship.rotation == "east" || ship.rotation == "west" ? r : 0));
    }
    drawShot(shot) {
        if (shot.hit)
            this.stroke(255, 0, 0);
        let w = this.width / this.x;
        let h = this.height / this.y;
        let xCentreStart = (shot.x + 0.5) * w;
        let yCentreStart = (shot.y + 0.5) * h;
        this.line(xCentreStart - w / 2, yCentreStart - h / 2, xCentreStart + w / 2, yCentreStart + h / 2);
        this.line(xCentreStart - w / 2, yCentreStart + h / 2, xCentreStart + w / 2, yCentreStart - h / 2);
    }
    placeShip(ship) {
        //check position is allowable
        if (!this.checkShip(ship))
            return false;
        // console.log("WIP");
        // this.placed_ships.push(ship);
        this.socket.emit("place", ship);
        this.placing = null;
        return true;
    }
    checkShip(ship) {
        let inx = 0, iny = 0;
        switch (ship.rotation) {
            case rotation.NORTH:
                iny = -1;
                break;
            case rotation.EAST:
                inx = +1;
                break;
            case rotation.SOUTH:
                iny = +1;
                break;
            case rotation.WEST:
                inx = -1;
                break;
        }
        for (let i = 0; i < ship.size; i++) {
            let X = ship.x + inx * i;
            let Y = ship.y + iny * i;
            if (X < 0 || X >= this.x ||
                Y < 0 || Y >= this.y) {
                return false;
            }
            for (let other of this.placed_ships) {
                let oinx = 0, oiny = 0;
                switch (other.rotation) {
                    case rotation.NORTH:
                        oiny = -1;
                        break;
                    case rotation.EAST:
                        oinx = +1;
                        break;
                    case rotation.SOUTH:
                        oiny = +1;
                        break;
                    case rotation.WEST:
                        oinx = -1;
                        break;
                }
                for (let j = 0; j < other.size; j++) {
                    let oX = other.x + oinx * j;
                    let oY = other.y + oiny * j;
                    if (X == oX && Y == oY) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
class defend extends base {
    constructor(socket) {
        super(socket, "defend");
        this.socket.removeAllListeners();
        this.addSocketListeners();
    }
    setup() {
        this.createCanvas(500, 500);
        // this.placing = {
        // 	x: 0,
        // 	y: 0,
        // 	rotation: rotation.NORTH,
        // 	size: 5,
        // }
        this.createElement("br");
        this.placeButton = this.createButton("Place");
        this.placeButton.mousePressed(() => this.placeShip(this.placing));
        this.rotateButton = this.createButton("Rotate");
        this.rotateButton.mousePressed(() => {
            switch (this.placing.rotation) {
                case rotation.NORTH:
                    this.placing.rotation = rotation.EAST;
                    break;
                case rotation.EAST:
                    this.placing.rotation = rotation.SOUTH;
                    break;
                case rotation.SOUTH:
                    this.placing.rotation = rotation.WEST;
                    break;
                case rotation.WEST:
                    this.placing.rotation = rotation.NORTH;
                    break;
            }
        });
    }
    addSocketListeners() {
        this.socket.on("reset", this.reset.bind(this));
        this.socket.on("battle", () => new attack(_socket));
        this.socket.on("placed", (ships) => {
            console.log("placed");
            this.placed_ships.push(...ships);
        });
        this.socket.on("place", (ship) => {
            console.log("place");
            this.placing = ship;
        });
        this.socket.on("shot", (shots) => {
            console.log("shot");
            this.shots.push(...shots);
        });
        this.socket.on("win", () => {
            alert("Congrats, You win!");
        });
        this.socket.on("lose", () => {
            alert("Oh, You lose.");
        });
    }
    keyPressed() {
        console.log(this.keyCode);
        if (this.keyCode == 0x20 && this.placing) {
            this.placeShip(this.placing);
        }
        else if (this.keyCode == 0x52 && this.placing) {
            switch (this.placing.rotation) {
                case rotation.NORTH:
                    this.placing.rotation = rotation.EAST;
                    break;
                case rotation.EAST:
                    this.placing.rotation = rotation.SOUTH;
                    break;
                case rotation.SOUTH:
                    this.placing.rotation = rotation.WEST;
                    break;
                case rotation.WEST:
                    this.placing.rotation = rotation.NORTH;
                    break;
            }
        }
    }
    reset() {
        this.remove();
        new defend(_socket);
    }
}
;
class attack extends base {
    constructor(socket) {
        super(socket, "attack");
        this.addSocketListeners();
    }
    setup() {
        this.createCanvas(500, 500);
        this.createElement("br");
        this.fireButton = this.createButton("Fire!");
        // this.fireButton.size(100, 30);
        this.fireButton.mouseClicked(() => {
            // this.shots.push(this.firing);
            this.socket.emit("fire", this.firing);
            this.firing = null;
        });
    }
    addSocketListeners() {
        this.socket.on("reset", this.reset.bind(this));
        this.socket.on("fire", () => {
            this.firing = {
                x: 0,
                y: 0,
                hit: false
            };
        });
        this.socket.on("fired", (shot) => {
            this.shots.push(...shot);
        }),
            this.socket.on("sunk", (ships) => {
                // console.log("sunk");
                this.placed_ships.push(...ships);
            });
    }
    keyPressed() {
        if (this.keyCode == 0x20 && this.firing) {
            // this.shots.push(this.firing);
            this.socket.emit("fire", this.firing);
            this.firing = null;
        }
    }
    reset() {
        this.remove();
    }
}
// let d = new defend(_socket);
