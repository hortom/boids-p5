class Agent {
	static average; // createVector is not available here

	constructor() {
		const angle = random(0, Math.PI * 2);
		const r = random(maxSpeed / 2, maxSpeed);

		if (Agent.average === undefined) Agent.average = createVector();

		this.position = createVector(random(0, width), random(0, height));
		this.velocity = createVector(Math.cos(angle) * r, Math.sin(angle) * r);
		this.acceleration = createVector();

		this.isNear = false; // near to the first agent

		subdiv.update(this); // update the item in the buckets

		this.show();
	}
	
	getNearAgents() {
		const agents = []; // Agents
		const distSq = []; // Distances
		const r2 = perceptionRadius * perceptionRadius;
		const near = subdiv.getNearItems(this);

		let nearLength = 0;
		near.forEach(a => nearLength += a.length);
		// Limit the max agent which will be used for steering.
		const step = nearLength > maxNearCount && !ACCURATE ? nearLength / maxNearCount : 1;

		near.forEach(arr => {
			for (let i = 0; i < arr.length; i += step) {
				const a = arr[Math.floor(i)];
				const d = (this.position.x - a.position.x) * (this.position.x - a.position.x) + (this.position.y - a.position.y) * (this.position.y - a.position.y);
				if (a !== this && d < r2) {
					agents.push(a);
					distSq.push(d);
					// debug
					a.isNear |= this.debug;
				}
			};
		});	
		
		return [agents, distSq];
	}

	separation(agents, distSq) {
		// Do not create a new vector
		const avg = Agent.average;
		avg.x = avg.y = 0;
		
		if (agents.length == 0) return avg;
		
		agents.forEach((a, i) => {
			const diff = p5.Vector.sub(this.position, a.position);
			diff.div(distSq[i]);
			avg.add(diff);
		});

		avg.div(agents.length);
		avg.setMag(maxSpeed);
		avg.sub(this.velocity);
		avg.limit(maxForce);

		return avg;
	}

	cohesion(agents) {
		// Do not create a new vector
		const avg = Agent.average;
		avg.x = avg.y = 0;
		
		if (agents.length == 0) return avg;

		agents.forEach(a => {
			avg.add(a.position);
		});

		avg.div(agents.length);
		avg.sub(this.position);
		avg.setMag(maxSpeed);
		avg.sub(this.velocity);
		avg.limit(maxForce);

		return avg;
	}

	align(agents) {
		// Do not create a new vector
		const avg = Agent.average;
		avg.x = avg.y = 0;
		
		if (agents.length == 0) return avg;

		agents.forEach(a => {
			avg.add(a.velocity);
		});

		avg.div(agents.length);
		avg.setMag(maxSpeed);
		avg.sub(this.velocity);
		avg.limit(maxForce);

		return avg;
	}

	flocking() {
		const arrays = this.getNearAgents();
		const agents = arrays[0];
		const distancesSq = arrays[1];

		this.acceleration.x = this.acceleration.y = 0;
		const sV = this.separation(agents, distancesSq).mult(sSliderValue);
		this.acceleration.add(sV);
		const cV = this.cohesion(agents).mult(cSliderValue);
		this.acceleration.add(cV);
		const aV = this.align(agents).mult(aSliderValue);
		this.acceleration.add(aV);
	}

	update(dv) {
		this.debug = DEBUG && flock[0] === this; // only for the first element

		this.flocking();

		this.position.add(this.velocity);
		
		if (this.position.x < 0) this.position.x += width;
		else if (this.position.x >= width) this.position.x -= width;
		if (this.position.y < 0) this.position.y += height;
		else if (this.position.y >= height) this.position.y -= height;

		subdiv.update(this);

		this.velocity.add(this.acceleration);
		this.velocity.limit(maxSpeed);

		this.show();
	}

	show() {
		// strokeWeight(!this.debug ? 6 : 8);
		// stroke(!this.debug ? (!this.isNear ? '#aaa' : '#f0f' ): '#ff0');
		// point(this.position.x, this.position.y);

		strokeWeight(!this.debug ? 1 : 2);
		stroke(!this.debug ? (!this.isNear ? '#aaa' : '#f0f' ): '#ff0');
		//fill(30);
		noFill(); // It is more performant without filling
		const r = 6;
		const angle = this.velocity.heading();
		const anglePlus = 2.5;

		triangle(
			this.position.x + Math.cos(angle) * r, this.position.y + Math.sin(angle) * r,
			this.position.x + Math.cos(angle + anglePlus) * r, this.position.y + Math.sin(angle + anglePlus) * r,
			this.position.x + Math.cos(angle - anglePlus) * r, this.position.y + Math.sin(angle - anglePlus) * r
		);

		if (this.debug) {
			strokeWeight(1);
			stroke('#0ff');
			noFill();
			circle(this.position.x, this.position.y, 2 * perceptionRadius);
		}

		this.isNear = false;
	}
}

