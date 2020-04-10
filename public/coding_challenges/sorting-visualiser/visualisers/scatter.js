Visualisers.push({
    name: "scatter",
    fxn: (arr, c) => {
        c.background(180, 180, 180);
        c.push();
        c.noStroke();
        c.colorMode(HSB);
        let a = arr.getArr();
        translate(0, height);
        for (let i = 0; i < a.length; i++) {
            let pScale = a[i] / a.length;
            let col = c.color(pScale * 360, 100, 100);
            c.stroke(col);
            c.strokeWeight(10);
            c.point(c.width / a.length, -c.height * pScale);
            c.translate(c.width / a.length, 0);
        }
        c.pop();
    }
});
//# sourceMappingURL=scatter.js.map