class inOrder extends Algorithm {
	private index: number = 0;


	sortIteration() {
		if (this.getComplete()) return;
		this.elems.set(this.index, this.index);
		this.index++;
	}

	getComplete() {
		if (this.elems.length <= this.index)
			return true;
		return false
	}
	setOpt(key: string, val: any) {}
}
class revOrder extends Algorithm {
	private index: number = 0;


	sortIteration() {
		if (this.getComplete()) return;
		this.elems.set(this.index, this.elems.length - 1 - this.index);
		this.index++;
	}

	getComplete() {
		if (this.elems.length <= this.index)
			return true;
		return false
	}
	setOpt(key: string, val: any) {}
}

Shuffles.push({
	name: "In-Order",
	constructor: inOrder,
}, {
	name: "Rev-Order",
	constructor: revOrder,
})