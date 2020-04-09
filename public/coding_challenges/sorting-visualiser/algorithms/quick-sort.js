var QuickSortState;
(function (QuickSortState) {
    QuickSortState[QuickSortState["START"] = 0] = "START";
    QuickSortState[QuickSortState["GETPIVOT"] = 1] = "GETPIVOT";
    QuickSortState[QuickSortState["FILTER"] = 2] = "FILTER";
    QuickSortState[QuickSortState["SOLVED"] = 3] = "SOLVED";
})(QuickSortState || (QuickSortState = {}));
class QuickSort extends Algorithm {
    constructor() {
        super(...arguments);
        this.state = 0;
        this.bt = [];
    }
    sort() {
    }
    sortIteration() {
        if (this.state == QuickSortState.START) {
            this.hi = this.elems.length - 1;
            this.lo = 0;
            this.state = QuickSortState.GETPIVOT;
        }
        if (this.state == QuickSortState.GETPIVOT) {
            this.pivot = this.elems.get(this.lo); //could be any value really
            this.anchor = this.lo;
            this.insert = this.hi;
            this.state = QuickSortState.FILTER;
        }
        if (this.state == QuickSortState.FILTER) {
            if ((this.hi - this.lo) < 1) {
                if (this.bt.length == 0) {
                    this.state = QuickSortState.SOLVED;
                }
                else {
                    [this.lo, this.hi] = this.bt.pop();
                    this.state = QuickSortState.GETPIVOT;
                }
                return;
            }
            let a = this.elems.get(this.anchor);
            if (a >= this.pivot) {
                this.elems.swap(this.anchor, this.insert);
                this.insert--;
            }
            else {
                this.anchor++;
            }
            if (this.anchor > this.insert) {
                if (this.anchor < this.hi)
                    this.bt.push([this.anchor, this.hi]);
                this.hi = this.insert;
                this.state = QuickSortState.GETPIVOT;
            }
        }
    }
    getComplete() {
        return this.state == QuickSortState.SOLVED;
    }
}
Algorithms.push({
    name: "quicksort",
    constructor: QuickSort
});
//# sourceMappingURL=quick-sort.js.map