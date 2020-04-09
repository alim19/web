/// <reference path="../../../../p5.global-mode.d.ts"/>
var count;
var countSlider;
var slider_label;
var frCounter;
var fr = 0;
var circles = [];
function setup() {
    var params = getURLParams();
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
}
function draw() {
    //@ts-ignore
    count = Math.floor(Math.pow(10, countSlider.value() / 20));
    console.log(count);
    slider_label.elt.innerText = (count);
    fr = fr + (frameRate() - fr) / 8;
    frCounter.elt.innerText = ", FrameRate: " + Math.floor(fr);
    while (circles.length > count) {
        circles.pop();
    }
    while (circles.length < count) {
        circles.push(new Circle(Math.random() * width, Math.random() * height, width * height / (1500 * Math.sqrt(count))));
    }
    background(0);
    for (var i = 0; i < circles.length; i++) {
        for (var j = 0; j < circles.length; j++) {
            if (circles[i] != circles[j] && circles[i].intersects(circles[j])) {
                circles[i].setHiglight(true);
                circles[j].setHiglight(true);
            }
        }
    }
    for (var _i = 0, circles_1 = circles; _i < circles_1.length; _i++) {
        var c = circles_1[_i];
        c.draw();
        c.move();
        c.setHiglight(false);
    }
}
var Circle = /** @class */ (function () {
    function Circle(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.highlight = false;
    }
    Circle.prototype.getRadius = function () {
        return this.r;
    };
    Circle.prototype.getX = function () {
        return this.x;
    };
    Circle.prototype.getY = function () {
        return this.y;
    };
    Circle.prototype.setHiglight = function (b) {
        this.highlight = b;
    };
    Circle.prototype.move = function () {
        this.x += Math.random() * 5 - 2.5;
        this.y += Math.random() * 5 - 2.5;
    };
    Circle.prototype.draw = function () {
        fill(100, 100, 100);
        if (this.highlight) {
            fill(180, 180, 180);
        }
        noStroke();
        ellipse(this.x, this.y, this.r * 2);
    };
    Circle.prototype.intersects = function (c) {
        var minD = c.getRadius() + this.r;
        minD *= minD;
        var dX = c.getX() - this.x;
        dX *= dX;
        var dY = c.getY() - this.y;
        dY *= dY;
        if (dX + dY < minD) {
            return true;
        }
        return false;
    };
    return Circle;
}());
new p5(null, document.getElementById("container"));
