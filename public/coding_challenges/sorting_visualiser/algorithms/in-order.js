class inOrder extends Algorithm {
    constructor() {
        super(...arguments);
        this.index = 0;
    }
    sortIteration() {
        if (this.getComplete())
            return;
        this.elems.set(this.index, this.index);
        this.index++;
    }
    getComplete() {
        if (this.elems.length <= this.index)
            return true;
        return false;
    }
    setOpt(key, val) { }
}
class revOrder extends Algorithm {
    constructor() {
        super(...arguments);
        this.index = 0;
    }
    sortIteration() {
        if (this.getComplete())
            return;
        this.elems.set(this.index, this.elems.length - 1 - this.index);
        this.index++;
    }
    getComplete() {
        if (this.elems.length <= this.index)
            return true;
        return false;
    }
    setOpt(key, val) { }
}
Shuffles.push({
    name: "In-Order",
    constructor: inOrder,
}, {
    name: "Rev-Order",
    constructor: revOrder,
});
//# sourceMappingURL=in-order.js.map