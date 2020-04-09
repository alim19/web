/// <reference path="../../../../p5.global-mode.d.ts"/>
let count;
let countSlider;
let circles = [];
function setup() {
    createCanvas(500, 500);
    let params = getURLParams();
    if (params["count"]) {
        count = params["count"];
    }
    else {
        count = 100;
    }
    //@ts-ignore
    countSlider = createSlider(1, 100, Math.log10(count) * 20, 1);
}
function draw() {
    //@ts-ignore
    count = Math.pow(10, countSlider.value() / 20);
    console.log(count);
    while (circles.length > count) {
        circles.pop();
    }
    while (circles.length < count) {
        circles.push(new Circle(Math.random() * width, Math.random() * height, width * height / (1500 * Math.sqrt(count))));
    }
    background(0);
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i] != circles[j] && circles[i].intersects(circles[j])) {
                circles[i].setHiglight(true);
                circles[j].setHiglight(true);
            }
        }
    }
    for (let c of circles) {
        c.draw();
        c.move();
        c.setHiglight(false);
    }
}
class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.highlight = false;
    }
    getRadius() {
        return this.r;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setHiglight(b) {
        this.highlight = b;
    }
    move() {
        this.x += Math.random() * 5 - 2.5;
        this.y += Math.random() * 5 - 2.5;
    }
    draw() {
        fill(100, 100, 100);
        if (this.highlight) {
            fill(180, 180, 180);
        }
        noStroke();
        ellipse(this.x, this.y, this.r * 2);
    }
    intersects(c) {
        let minD = c.getRadius() + this.r;
        minD *= minD;
        let dX = c.getX() - this.x;
        dX *= dX;
        let dY = c.getY() - this.y;
        dY *= dY;
        if (dX + dY < minD) {
            return true;
        }
        return false;
    }
}
new p5(null, document.getElementById("container"));
//# sourceMappingURL=test-every-optim.js.map