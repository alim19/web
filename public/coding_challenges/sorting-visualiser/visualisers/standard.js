Visualisers.push({
    name: "standard",
    fxn: (arr, c) => {
        c.background(180, 180, 180);
        c.push();
        c.noStroke();
        c.colorMode(HSB);
        let a = arr.getArr();
        for (let i = 0; i < a.length; i++) {
            let pScale = a[i] / a.length;
            let col = c.color(pScale * 360, 100, 100);
            c.fill(col);
            c.rect(0, height, c.width / a.length, -c.height * pScale);
            c.translate(c.width / a.length, 0);
        }
        c.pop();
    }
});
//# sourceMappingURL=standard.js.map