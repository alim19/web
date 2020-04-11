class FisherYates extends Algorithm {
	shuffle_pos: number = 0;


	sortIteration() {
		if (this.getComplete()) return;
		let Other = Math.floor(Math.random() * this.elems.length);
		this.elems.swap(this.shuffle_pos, Other);
		this.shuffle_pos++;
	}

	getComplete() {
		if (this.elems.length <= this.shuffle_pos)
			return true;
		return false
	}
	setOpt(key: string, val: any) {}
}

Shuffles.push({
	name: "Fisher Yeates Shuffle",
	constructor: FisherYates,
})