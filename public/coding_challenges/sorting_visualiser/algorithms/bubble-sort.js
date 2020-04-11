class BubbleSort extends Algorithm {
    constructor() {
        super(...arguments);
        this.noIters = 0;
        this.position = 0;
    }
    sortIteration() {
        let a = this.elems.get(this.position);
        let b = this.elems.get(this.position + 1);
        if (a > b) {
            // this.elems.set(this.position + 1, a);
            // this.elems.set(this.position, b);
            this.elems.swap(this.position, this.position + 1);
        }
        this.position++;
        // console.log(this.position, this.noIters)
        if (this.position >= (this.elems.length - this.noIters - 1)) {
            this.noIters++;
            this.position = 0;
        }
    }
    getComplete() {
        return this.noIters >= (this.elems.length - 1);
    }
    setOpt(key, val) { }
}
Algorithms.push({
    name: "bubble",
    constructor: BubbleSort,
});
//# sourceMappingURL=bubble-sort.js.map