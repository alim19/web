/// <reference path="../../../../p5.global-mode.d.ts"/>

interface Boundary {
	type: 'boundary' | 'circle';
	x: number;
	y: number;
	w ? : number;
	h ? : number;
	r ? : number;
}



interface QTreeElem {
	x: number;
	y: number;
	obj ? : any;
	boundary ? : Boundary;
}

class QuadTree {
	bounds: Boundary;
	maxElems: number = 4;
	elems: QTreeElem[] = [];
	children: QuadTree[];
	constructor(bounds: Boundary, maxElems ? : number) {
		this.bounds = bounds;
		if (maxElems) this.maxElems = maxElems;
	}

	insert(elem: QTreeElem) {
		if (!this.children) {
			if (this.elems.length >= this.maxElems) {
				//generate children
				this.children = [];
				for (let i = 0; i < 2; i++) {
					for (let j = 0; j < 2; j++) {
						this.children.push(new QuadTree({
							type: 'boundary',
							x: this.bounds.x + i * this.bounds.w / 2,
							y: this.bounds.y + j * this.bounds.h / 2,
							w: this.bounds.w / 2,
							h: this.bounds.h / 2
						}, this.maxElems));
					}
				}
				for (let i = 0; i < this.elems.length; i++) {
					this.insert(this.elems[i]);
				}
				this.insert(elem);

				this.elems = [];
			} else {
				this.elems.push(elem);
			}
		} else {
			//find which child
			for (let child of this.children) {
				if (child.bounds.x <= elem.x && child.bounds.y <= elem.y &&
					child.bounds.x + child.bounds.w > elem.x && child.bounds.y + child.bounds.h > elem.y) {
					child.insert(elem);
				}
			}
		}
	}

	draw() {
		noFill();
		stroke(100, 100, 100);
		strokeWeight((this.bounds.w + this.bounds.h) / 200);
		rect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
		if (this.children) {
			for (let c of this.children) {
				c.draw();
			}
		}
	}

	query(b: Boundary): QTreeElem[] {
		let elems: QTreeElem[] = [];
		if (b.type == 'circle') {
			let nb: Boundary = {
				type: 'boundary',
				x: b.x - b.r,
				y: b.y - b.r,
				w: b.r * 2,
				h: b.r * 2,
			}
			return this.query(nb);

		} else if (b.type == 'boundary') {
			if (this.children) {
				for (let c of this.children) {
					//AABB
					if (b.x < c.bounds.x + c.bounds.w &&
						b.x + b.w > c.bounds.x &&
						b.y < c.bounds.y + c.bounds.h &&
						b.y + b.h > c.bounds.y) {

						elems.push(...c.query(b));
					}
				}
			} else {
				for (let e of this.elems) {
					if (e.x > b.x && e.y > b.y &&
						e.x < b.x + b.w && e.y < b.y + b.h) {
						elems.push(e);
					}
				}
			}
		}

		return elems;
	}
}