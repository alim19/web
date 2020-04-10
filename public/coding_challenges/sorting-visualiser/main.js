/// <reference path="../../../p5.global-mode.d.ts" />
/// <reference path="./visualiser.ts" />
/// <reference path="./algo.ts" />
let Bar;
let sBar;
let Arr;
let Algo;
let AlgoName;
let Vis;
let visSelect;
let algoSelect;
let sOpts;
let sReset;
let sAccessors;
let sWrites;
let params;
let shuffled = false;
let sorting = false;
let speed;
//@ts-ignore
let count = 0;
function setup() {
    params = getURLParams();
    if (params["count"])
        Arr = new WatchedArray(parseInt(params["count"]));
    else
        Arr = new WatchedArray(100);
    if (params["speed"])
        speed = parseFloat(params["speed"]);
    else
        speed = 1;
    //@ts-ignore
    Bar = createDiv();
    Bar.id("bar");
    //@ts-ignore
    sBar = createSpan();
    sBar.parent(Bar);
    visSelect = createSelect(false);
    visSelect.parent(sBar);
    for (let v of Visualisers) {
        //@ts-ignore
        visSelect.option(v.name);
    }
    //@ts-ignore
    let ShuffleButton = createButton("Shuffle");
    ShuffleButton.parent(sBar);
    ShuffleButton.mouseClicked(() => {
        Algo = new FisherYates(Arr);
        AlgoName = "shuffle";
        // shuffled = false;
        sorting = true;
    });
    ShuffleButton.doubleClicked(() => {
        if (Algo)
            Algo.sort();
    });
    algoSelect = createSelect(false);
    algoSelect.parent(sBar);
    for (let a of Algorithms) {
        //@ts-ignore
        algoSelect.option(a.name);
    }
    algoSelect.value(params["algo"]);
    algoSelect.input(createOptSels);
    //@ts-ignore
    let SortButton = createButton("Sort");
    SortButton.parent(sBar);
    SortButton.mouseClicked(() => {
        if (shuffled && !sorting) {
            sorting = true;
            if (algoSelect.elt.value) {
                let A = Algorithms.reduce((a, c) => c.name == algoSelect.elt.value ? c : a, null);
                let AlgoCon = A.constructor;
                if (AlgoCon) {
                    Algo = new AlgoCon(Arr);
                    AlgoName = algoSelect.elt.value;
                    //set opts
                    let opts = document.getElementsByClassName("sort_opt");
                    for (let elem of opts) {
                        let id = elem.id.split(':')[1];
                        //@ts-ignore
                        Algo.setOpt(id, A.opts[id].reduce((a, c) => c[0] == elem.value ? c[1] : a, -1));
                    }
                }
            }
        }
    });
    SortButton.doubleClicked(() => {
        if (Algo)
            Algo.sort();
    });
    //@ts-ignore
    sAccessors = createSpan();
    sAccessors.parent(Bar);
    //@ts-ignore
    sWrites = createSpan();
    sWrites.parent(Bar);
    //@ts-ignore
    sOpts = createSpan();
    sOpts.parent(Bar);
    sOpts.style("margin-left", "10px");
    //@ts-ignore
    sReset = createSpan();
    sReset.parent(Bar);
    sReset.style("position", "relative");
    sReset.style("float", "right");
    //@ts-ignore
    let resetButton = createButton("Reset.");
    resetButton.parent(sReset);
    resetButton.mouseClicked(() => {
        Algo = null;
        if (params["count"])
            Arr = new WatchedArray(parseInt(params["count"]));
        else
            Arr = new WatchedArray(100);
    });
    // resetButton.style("position", "absolute");
    // resetButton.style("right", "0");
    // resetButton.style("position", "absolute");
    createOptSels();
    createCanvas(windowWidth - 40, 700);
}
function draw() {
    if (Algo) {
        while (count > 1) {
            Algo.sortIteration();
            count--;
        }
        count += speed;
        if (Algo.getComplete()) {
            Algo = null;
            if (AlgoName == "shuffle") {
                shuffled = true;
                Arr.resetStats();
            }
            else {
                shuffled = false;
            }
            sorting = false;
            AlgoName = null;
        }
    }
    sAccessors.html(`Accesses ${Arr.getAccesses()} | `);
    sWrites.html(`Writes ${Arr.getWrites()}`);
    Vis = Visualisers.reduce((v, c) => c.name == visSelect.value() ? c.fxn : v, null);
    if (Vis)
        Vis(Arr, this);
}
function windowResized() {
    resizeCanvas(windowWidth - 30, height);
}
function createOptSels() {
    let old_opts = document.getElementsByClassName("sort_opt");
    while (old_opts.length)
        old_opts[0].remove();
    //create new opts
    let algoOpts = Algorithms.reduce((a, c) => c.name == algoSelect.elt.value ? c : a, null).opts;
    if (algoOpts) {
        for (let opt_key in algoOpts) {
            let optSel = createSelect(false);
            optSel.parent(sOpts);
            optSel.addClass("sort_opt");
            optSel.id(`sort_opt:${opt_key}`);
            for (let opt of algoOpts[opt_key]) {
                //@ts-ignore
                optSel.option(opt[0]);
            }
            optSel.input(() => {
                if (Algo) {
                    Algo.setOpt(opt_key, algoOpts[opt_key].reduce((a, c) => c[0] == optSel.value() ? c[1] : a, -1));
                }
            });
        }
    }
}
// new p5(null, document.getElementById("sorter"));
//@ts-ignore
new p5(null, "sorter");
//# sourceMappingURL=main.js.map