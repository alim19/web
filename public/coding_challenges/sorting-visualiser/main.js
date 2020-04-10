/// <reference path="../../../p5.global-mode.d.ts" />
/// <reference path="./visualiser.ts" />
/// <reference path="./algo.ts" />
let Bar;
let sBar;
let Arr;
let Algo;
let AlgoName;
let ColFxn;
let Vis;
let visSelect;
let colSelect;
let shufSelect;
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
    ColFxn = Colors[0].fxn;
    params = getURLParams();
    if (params["count"])
        Arr = new WatchedArray(parseInt(params["count"]));
    else
        Arr = new WatchedArray(100);
    if (params["speed"])
        speed = parseFloat(params["speed"]);
    else
        speed = 1;
    createConfigBar();
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
    sAccessors.html(`Accesses ${Arr.reads} | `);
    sWrites.html(`Writes ${Arr.writes}`);
    Vis = Visualisers.reduce((v, c) => c.name == visSelect.value() ? c.fxn : v, null);
    if (Vis)
        Vis(Arr, this, ColFxn);
    // console.log(Arr.written.reduce((c, _c) => c + (_c ? 1 : 0), 0));
    Arr.written = [false];
    Arr.read = [false];
}
function windowResized() {
    resizeCanvas(windowWidth - 30, height);
}
function createConfigBar() {
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
    colSelect = createSelect(false);
    colSelect.parent(sBar);
    for (let c of Colors) {
        //@ts-ignore
        colSelect.option(c.name);
    }
    colSelect.input(setColScheme);
    setColScheme();
    shufSelect = createSelect(false);
    shufSelect.parent(sBar);
    for (let s of Shuffles) {
        //@ts-ignore
        shufSelect.option(s.name);
    }
    //@ts-ignore
    shufSelect.input(() => createOptSels(shufSelect.value()));
    //@ts-ignore
    let ShuffleButton = createButton("Shuffle");
    ShuffleButton.parent(sBar);
    ShuffleButton.mouseClicked(() => {
        if (shufSelect.elt.value) {
            let A = Shuffles.reduce((a, c) => c.name == shufSelect.elt.value ? c : a, null);
            let AlgoCon = A.constructor;
            if (AlgoCon) {
                Algo = new AlgoCon(Arr);
                AlgoName = "shuffle";
                //set opts
                let opts = document.getElementsByClassName("sort_opt");
                if (A.opts)
                    for (let elem of opts) {
                        let id = elem.id.split(':')[1];
                        //@ts-ignore
                        Algo.setOpt(id, A.opts[id].reduce((a, c) => c[0] == elem.value ? c[1] : a, -1));
                    }
            }
        }
    });
    ShuffleButton.doubleClicked(finishAlgo);
    algoSelect = createSelect(false);
    algoSelect.parent(sBar);
    for (let a of Algorithms) {
        //@ts-ignore
        algoSelect.option(a.name);
    }
    algoSelect.value(params["algo"]);
    //@ts-ignore
    algoSelect.input(() => createOptSels(algoSelect.value()));
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
                    if (A.opts)
                        for (let elem of opts) {
                            let id = elem.id.split(':')[1];
                            //@ts-ignore
                            Algo.setOpt(id, A.opts[id].reduce((a, c) => c[0] == elem.value ? c[1] : a, -1));
                        }
                }
            }
        }
    });
    SortButton.doubleClicked(finishAlgo);
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
    //@ts-ignore
    createOptSels(shufSelect.value());
    //@ts-ignore
    createOptSels(algoSelect.value());
}
function createOptSels(algoName) {
    let old_opts = document.getElementsByClassName("sort_opt");
    while (old_opts.length)
        old_opts[0].remove();
    //create new opts
    let algoOpts = Algorithms.concat(Shuffles).reduce((a, c) => c.name == algoName ? c : a, null).opts;
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
function setColScheme() {
    ColFxn = Colors.reduce((a, c) => c.name == colSelect.value() ? c : a, null).fxn;
}
function finishAlgo() {
    if (Algo)
        Algo.sort();
}
// new p5(null, document.getElementById("sorter"));
//@ts-ignore
new p5(null, "sorter");
//# sourceMappingURL=main.js.map