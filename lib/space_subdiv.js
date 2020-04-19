/**
 * Items should have 2 properties:
 * - bucket: number, in which bucket 
 * - bucket_index: index in the bucket
 * - position: 2D Vector
 */
class SubDiv {
	constructor(w, h, s) {
		this.debug = false;
		this.size = s;
		this.buckets = [];
		this.rowLength = Math.ceil(w / s);
		this.count = this.rowLength * Math.ceil(h / s);

		for (let i = 0; i < this.count; i++) {
			this.buckets.push([]);
		}
	}

	update(item) {
		const i = Math.floor(item.position.y / this.size) * this.rowLength + Math.floor(item.position.x / this.size);
		if (i !== item.bucket) {
			if (item.bucket !== undefined) {
				const oldB = this.buckets[item.bucket];
				const ii = item.bucket_index;//oldB.indexOf(item);
				// Remove from the old bucket
				oldB[ii] = oldB[oldB.length - 1]; // It will be replaced with the last item.
				oldB[ii].bucket_index = ii; // update the index.
				oldB.pop(); // And the last item will be removed.
			}
			item.bucket = i;
			item.bucket_index = this.buckets[i].length;
			this.buckets[i].push(item);
		}
	}

	getNearItems(item, dbg = false) {
		this.debug = dbg;
		let all = [];
		// Item is in the center, get the top left corner from the 3x3
		let y = Math.floor(item.bucket / this.rowLength);
		let x = item.bucket - y * this.rowLength;
		let i = item.bucket - 1 - this.rowLength;
		x--;
		y--;
		x *= this.size;
		y *= this.size;

		/**
		 * 00 01 02
		 * X0 X1 X2
		 * Y0 Y1 Y2
		 */
		this.concat(all, i, x, y); // 00
		i++;
		x += this.size;
		this.concat(all, i, x, y); // 01
		i++;
		x += this.size;
		this.concat(all, i, x, y); // 02
		i += this.rowLength - 2;
		x -= this.size + this.size;
		y += this.size;

		this.concat(all, i, x, y); // X0
		i++;
		x += this.size;
		this.concat(all, i, x, y); // X1
		i++;
		x += this.size;
		this.concat(all, i, x, y); // X2
		i += this.rowLength - 2;
		x -= this.size + this.size;
		y += this.size;

		this.concat(all, i, x, y); // Y0
		i++;
		x += this.size;
		this.concat(all, i, x, y); // Y1
		i++;
		x += this.size;
		this.concat(all, i, x, y); // Y2

		return all;
	}

	concat(all, i, x, y) {
		if (x >= 0 && y >= 0 && x < width && y < height) { 			
			all.push(this.buckets[i]); // collect the buckets onnly and iterate on them later - should be faster
			if (this.debug) this.addDebugSquare(x, y);
		}
	}

	getDebugGrid() {
		noFill();
		strokeWeight(1);
		stroke(48);

		for (let i = this.size; i < width; i+= this.size) {
			line(i, 0, i, height);
		}

		for (let i = this.size; i < height; i+= this.size) {
			line(0, i, width, i);
		}

		return this.visual;
	}

	addDebugSquare(x, y) {
		strokeWeight(1);
		stroke(0, 0, 128);
		fill('#0081');
		rect(x, y, this.size, this.size);
	}
}
