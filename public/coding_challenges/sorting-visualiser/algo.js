/// <reference path="visualiser.ts" />
class Algorithm {
    constructor(arr) {
        this.elems = arr;
    }
    sort() {
        while (!this.getComplete())
            this.sortIteration();
    }
}
let Algorithms = [];
//# sourceMappingURL=algo.js.map