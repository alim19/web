/// <reference path="../../../p5.global-mode.d.ts" />
let builder = (sketch) => { return (p) => { for (let key in sketch)
    if (typeof (sketch[key]) == "function")
        p[key] = sketch[key].bind(p);
    else
        p[key] = sketch[key]; }; };
var rotation;
(function (rotation) {
    rotation["NORTH"] = "north";
    rotation["EAST"] = "east";
    rotation["SOUTH"] = "south";
    rotation["WEST"] = "west";
})(rotation || (rotation = {}));
const base = {
    draw: function () {
        this.background(100);
        //draw ships
        //draw shots
        //draw grid
        this.drawGrid();
    },
    drawGrid: function () {
        this.strokeWeight(5);
        this.stroke(0);
        for (let i = 0; i <= this.x; i++) {
            this.line(i * this.width / this.x, 0, i * this.width / this.x, this.height);
        }
        for (let i = 0; i <= this.y; i++) {
            this.line(0, i * this.height / this.y, this.width, i * this.height / this.y);
        }
    },
    drawShip: function (ship) {
    }
};
const defend = {
    ...base,
    x: 10,
    y: 10,
    setup: function () {
        this.createCanvas(500, 500);
    },
};
const attack = {
    ...base,
    x: 10,
    y: 10,
    setup: function () {
        this.createCanvas(500, 500);
    }
};
const defender = new p5(builder(defend), "defend");
const attacker = new p5(builder(attack), "attack");
