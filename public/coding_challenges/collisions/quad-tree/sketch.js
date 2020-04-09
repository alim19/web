/// <reference path="./qtree.ts" />
/// <reference path="../../../../p5.global-mode.d.ts"/>
let count;
let countSlider;
let slider_label;
let frCounter;
let fr = 0;
let circles = [];
let b = {
    type: 'boundary',
    x: 0,
    y: 0,
    w: 500,
    h: 500,
};
function setup() {
    let params = getURLParams();
    if (params["count"]) {
        count = params["count"];
    }
    else {
        count = 100;
    }
    //@ts-ignore
    countSlider = createSlider(0, 80, Math.log10(count) * 20, 0.1);
    countSlider.id("CountSlider");
    // createElement("br");
    //@ts-ignore
    slider_label = createElement("label");
    slider_label.attribute("for", "CountSlider");
    //@ts-ignore
    frCounter = createElement("label");
    createElement("br");
    createCanvas(500, 500);
    frameRate(30);
}
function draw() {
    let qtree = new QuadTree(b);
    //@ts-ignore
    count = Math.floor(Math.pow(10, countSlider.value() / 20));
    slider_label.elt.innerText = (count);
    fr = fr + (frameRate() - fr) / 8;
    frCounter.elt.innerText = `, FrameRate: ${Math.floor(fr)}`;
    // console.log(count);
    while (circles.length > count) {
        circles.pop();
    }
    while (circles.length < count) {
        circles.push(new Circle(Math.random() * width, Math.random() * height, 10));
    }
    for (let c of circles) {
        qtree.insert({
            x: c.getX(),
            y: c.getY(),
            obj: c,
        });
    }
    // console.log(qtree);
    background(0);
    for (let c of circles) {
        let poss = qtree.query({
            type: 'circle',
            x: c.getX(),
            y: c.getY(),
            r: c.getRadius() * 2,
        });
        for (let { obj } of poss) {
            if (obj != c && c.intersects(obj)) {
                c.setHiglight(true);
                obj.setHiglight(true);
            }
        }
    }
    for (let c of circles) {
        c.draw();
        c.move();
        c.setHiglight(false);
    }
    qtree.draw();
    // noLoop();
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
//# sourceMappingURL=sketch.js.map