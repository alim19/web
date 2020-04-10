class FisherYates extends Algorithm {
    constructor() {
        super(...arguments);
        this.shuffle_pos = 0;
    }
    sortIteration() {
        if (this.getComplete())
            return;
        let Other = Math.floor(Math.random() * this.elems.length);
        this.elems.swap(this.shuffle_pos, Other);
        this.shuffle_pos++;
    }
    getComplete() {
        if (this.elems.length <= this.shuffle_pos)
            return true;
        return false;
    }
    setOpt(key, val) { }
}
//# sourceMappingURL=fisher-yates.js.map