/**
 * This is a Boids simulation, based on Daniel Shiffman's CodingTrain video: https://www.youtube.com/watch?v=mhjuuHl6qHM
 * 
 * It uses:
 *   p5.js
 *   space_subdiv.js is a basic space subdivision library by me
 */

// Global variables - START ====
let DEBUG = true;
let ACCURATE = false; // If this is `false` then we are using `maxNearCount` to reduce calculation.

const width = 1000;
const height = 700;

const flock = [];
const flockPool = [];
// Agent count
let count = 1500;
const maxCount = 5000;
// Maximum number which is used for one agent to steer to. Statistically, it is correct and a good optimisation.
// On a 2016 MacBook Pro, 1500 agents are still 20 FPS with debug and without accurate calculation.
const maxNearCount = 100;

// Also good for speed up things, if we reduce the radius, but let leave it at 100.
const perceptionRadius = 100;
const maxForce = 0.2;
const maxSpeed = 4;

let alignSlider, cohesionSlider, separationSlider, countSlider;
let alignValue, cohesionValue, separationValue, countValue;
let aSliderValue = 1, cSliderValue = 1, sSliderValue = 1;

/**
 * Basic space subdivision - it is helpful above ~500 agent at the start when they are evenly distributed.
 * The 3rd parameter is important to use the right size buckets. So, 9 buckets will have every agent near.
 */
const subdiv = new SubDiv(width, height, perceptionRadius);
// Global variables - END =====

function setup() {
	createCanvas(width, height);

	createDiv('Alignment:').class('sliderLabel');
	alignSlider = createSlider(0, 5, aSliderValue, 0.1).class('slider');
	alignSlider.attribute('oninput', `dispaySliderValue(alignSlider, alignValue)`);
	alignValue = createDiv(aSliderValue).class('sliderValue');

	createDiv('Cohesion:').class('sliderLabel');
	cohesionSlider = createSlider(0, 5, cSliderValue, 0.1).class('slider');
	cohesionSlider.attribute('oninput', `dispaySliderValue(cohesionSlider, cohesionValue)`);
	cohesionValue = createDiv(cSliderValue).class('sliderValue');

	createDiv('Separation:').class('sliderLabel');
	separationSlider = createSlider(0, 5, sSliderValue, 0.1).class('slider');
	separationSlider.attribute('oninput', `dispaySliderValue(separationSlider, separationValue)`);
	separationValue = createDiv(sSliderValue).class('sliderValue');

	const dbgCheckbox = createCheckbox('Debug', DEBUG).class('checkbox');
	dbgCheckbox.changed(() => DEBUG = dbgCheckbox.checked());

	const accCheckbox = createCheckbox('Accurate', ACCURATE).class('checkbox');
	accCheckbox.changed(() => ACCURATE = accCheckbox.checked());

	document.body.appendChild(document.createElement('br'));

	createDiv('Agent count:').class('sliderLabel agent');
	countSlider = createSlider(100, maxCount, count, 50).class('slider');
	countSlider.attribute('oninput', `dispaySliderValue(countSlider, countValue)`);
	countValue = createDiv(count).class('sliderValue');

	for (let i = 0; i < maxCount; i++) {
		flockPool.push(new Agent());
	}

	updateCount(count);
}

function dispaySliderValue(slider, val) {
	val.html(slider.value());

	// update all values
	aSliderValue = alignSlider.value();
	cSliderValue = cohesionSlider.value();
	sSliderValue = separationSlider.value();

	updateCount(countSlider.value());
}

function updateCount(c) {
	if (c === flock.length) return;

	count = c;

	if (flock.length < count) {
		while (flock.length < count) {
			flock.push(flockPool[flock.length]);
		}
	} else {
		while (flock.length > count) {
			flock.pop();
		}
	}
}

function draw() {
	background(64);

	flock.forEach(agent => {
		agent.update();
	});

	if (DEBUG) {
		subdiv.getDebugGrid();
		subdiv.getNearItems(flock[0], true);
	}
}
