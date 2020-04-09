/// <reference path="../../../p5.global-mode.d.ts" />
/// <reference path="./visualiser.ts" />
/// <reference path="./algo.ts" />
let Arr;
let Algo;
let AlgoName;
let Vis;
let visSelect;
let algoSelect;
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
    visSelect = createSelect(false);
    for (let v of Visualisers) {
        //@ts-ignore
        visSelect.option(v.name);
    }
    //@ts-ignore
    let ShuffleButton = createButton("Shuffle");
    ShuffleButton.mouseClicked(() => {
        Algo = new FisherYates(Arr);
        AlgoName = "shuffle";
        // shuffled = false;
        sorting = true;
    });
    algoSelect = createSelect(false);
    for (let a of Algorithms) {
        //@ts-ignore
        algoSelect.option(a.name);
    }
    algoSelect.value(params["algo"]);
    //@ts-ignore
    let SortButton = createButton("Sort");
    SortButton.mouseClicked(() => {
        if (shuffled && !sorting) {
            sorting = true;
            if (algoSelect.elt.value) {
                let AlgoCon = Algorithms.reduce((a, c) => c.name == algoSelect.elt.value ? c : a, null).constructor;
                if (AlgoCon) {
                    Algo = new AlgoCon(Arr);
                    AlgoName = algoSelect.elt.value;
                }
            }
            //  else
            // if (params["algo"]) {
            // 	let AlgoCon: AlgorithmConstructor = Algorithms.reduce((a, c) => c.name == params["algo"] ? c : a, null).constructor;
            // 	if (AlgoCon) {
            // 		Algo = new AlgoCon(Arr);
            // 		AlgoName = params["algo"];
            // 	}
            // }
        }
    });
    //@ts-ignore
    sAccessors = createSpan();
    //@ts-ignore
    sWrites = createSpan();
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
//# sourceMappingURL=main.js.map