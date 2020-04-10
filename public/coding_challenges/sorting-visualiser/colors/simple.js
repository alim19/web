Colors.push({
    name: "White+Red",
    fxn: (c, v, r, w) => {
        c.push();
        c.colorMode(HSB);
        let col;
        // col = c.color(0, 0, (1 - v) * 100);
        if (r || w)
            col = c.color(0, 100, 100);
        else
            col = c.color(0, 0, 100);
        if (w)
            console.log("w");
        c.pop();
        return col;
    }
});
//# sourceMappingURL=simple.js.map