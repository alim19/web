Visualisers.push({
    name: "pie",
    fxn: (arr, c) => {
        c.background(180, 180, 180);
        c.push();
        let scale = Math.min(c.width, c.height) - 5;
        c.translate(c.width / 2, c.height / 2);
        let a = arr.getArr();
        c.noStroke();
        c.colorMode(HSB);
        c.angleMode("degrees");
        for (let i = 0; i < a.length; i++) {
            let pScale = a[i] / a.length;
            let col = c.color(pScale * 360, 100, 100);
            c.fill(col);
            c.arc(0, 0, scale, scale, 0, 360 / a.length);
            c.rotate(360 / a.length);
        }
        c.pop();
    }
});
//# sourceMappingURL=pie.js.map