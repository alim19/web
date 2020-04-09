/// <reference path="../../../p5.global-mode.d.ts" />
class WatchedArray {
    constructor(size) {
        this.accesses = 0;
        this.writes = 0;
        this.arr = [];
        for (let i = 0; i < size; i++) {
            this.arr[i] = i;
        }
        this.length = size;
    }
    resetStats() {
        this.accesses = 0;
        this.writes = 0;
    }
    getAccesses() {
        return this.accesses;
    }
    getWrites() {
        return this.writes;
    }
    get(idx) {
        if (idx >= this.length)
            console.error(`Invalid index : ${idx}`);
        this.accesses++;
        return this.arr[idx];
    }
    set(idx, val) {
        if (idx >= this.length)
            console.error(`Invalid index : ${idx}`);
        this.writes++;
        this.arr[idx] = val;
    }
    getArr() {
        return this.arr;
    }
    swap(idx1, idx2) {
        if (idx1 >= this.length)
            console.error(`Invalid index : ${idx1}`);
        if (idx2 >= this.length)
            console.error(`Invalid index : ${idx2}`);
        // this.accesses += 2;
        this.writes += 2;
        let tmp = this.arr[idx1];
        this.arr[idx1] = this.arr[idx2];
        this.arr[idx2] = tmp;
    }
}
let Visualisers = [];
//# sourceMappingURL=visualiser.js.map