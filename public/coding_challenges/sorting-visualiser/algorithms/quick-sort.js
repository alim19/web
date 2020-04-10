var QuickSortState;
(function (QuickSortState) {
    QuickSortState[QuickSortState["START"] = 0] = "START";
    QuickSortState[QuickSortState["GETPIVOT"] = 1] = "GETPIVOT";
    QuickSortState[QuickSortState["FILTER"] = 2] = "FILTER";
    QuickSortState[QuickSortState["SOLVED"] = 3] = "SOLVED";
})(QuickSortState || (QuickSortState = {}));
var QuickSortPivot;
(function (QuickSortPivot) {
    QuickSortPivot[QuickSortPivot["LOW"] = 0] = "LOW";
    QuickSortPivot[QuickSortPivot["MIDDLE"] = 1] = "MIDDLE";
    QuickSortPivot[QuickSortPivot["HIGH"] = 2] = "HIGH";
    QuickSortPivot[QuickSortPivot["RANDOM"] = 3] = "RANDOM";
    QuickSortPivot[QuickSortPivot["LMH_MEAN"] = 4] = "LMH_MEAN";
})(QuickSortPivot || (QuickSortPivot = {}));
class QuickSort extends Algorithm {
    constructor() {
        super(...arguments);
        this.state = 0;
        this.pivotType = 0;
        this.bt = [];
    }
    sortIteration() {
        if (this.state == QuickSortState.START) {
            this.hi = this.elems.length - 1;
            this.lo = 0;
            this.state = QuickSortState.GETPIVOT;
        }
        if (this.state == QuickSortState.GETPIVOT) {
            switch (this.pivotType) {
                case QuickSortPivot.LOW:
                    this.pivotIdx = this.lo + 1;
                    this.pivot = this.elems.get(this.pivotIdx);
                    break;
                case QuickSortPivot.MIDDLE:
                    // this.pivot = this.elems.get(this.lo) + this.elems.get(this.hi);
                    // this.pivot /= 2;
                    this.pivotIdx = Math.floor((this.lo + this.hi) / 2);
                    this.pivot = this.elems.get(this.pivotIdx);
                    break;
                case QuickSortPivot.HIGH:
                    this.pivotIdx = this.hi;
                    this.pivot = this.elems.get(this.pivotIdx);
                    break;
                case QuickSortPivot.RANDOM:
                    // this.pivot = this.elems.get(Math.floor(Math.random() * (this.hi - this.lo)));
                    // this.pivot += this.elems.get(Math.floor(Math.random() * (this.hi - this.lo)));
                    // this.pivot /= 2;
                    this.pivotIdx = Math.floor(Math.random() * (this.hi - this.lo)) + this.lo;
                    this.pivot = this.elems.get(this.pivotIdx);
                    break;
                case QuickSortPivot.LMH_MEAN:
                    this.pivot = this.elems.get(this.lo) + 1 + this.elems.get(this.hi) + this.elems.get(Math.round((this.lo + this.hi) / 2)); //could be any value really
                    this.pivot /= 3;
                    break;
            }
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
    setOpt(key, val) {
        if (key == "pivotmode") {
            this.pivotType = val;
        }
    }
}
Algorithms.push({
    name: "quicksort",
    constructor: QuickSort,
    opts: {
        "pivotmode": [
            ["first", QuickSortPivot.LOW],
            ["middle", QuickSortPivot.MIDDLE],
            ["last", QuickSortPivot.HIGH],
            ["random", QuickSortPivot.RANDOM],
            ["average", QuickSortPivot.LMH_MEAN]
        ]
    }
});
//# sourceMappingURL=quick-sort.js.map