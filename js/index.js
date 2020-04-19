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
// Agent count
const count = 1500;
// Maximum number which is used for one agent to steer to. Statistically, it is correct and a good optimisation.
// On a 2016 MacBook Pro, 1500 agents are still 20 FPS with debug and without accurate calculation.
const maxNearCount = 100;

// Also good for speed up things, if we reduce the radius, but let leave it at 100.
const perceptionRadius = 100;
const maxForce = 0.2;
const maxSpeed = 4;

let alignSlider, cohesionSlider, separationSlider;
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
	createDiv('Cohesion:').class('sliderLabel');
	cohesionSlider = createSlider(0, 5, cSliderValue, 0.1).class('slider');
	createDiv('Separation:').class('sliderLabel');
	separationSlider = createSlider(0, 5, sSliderValue, 0.1).class('slider');

	const dbgCheckbox = createCheckbox('Debug', DEBUG).class('checkbox');
	dbgCheckbox.changed(() => DEBUG = dbgCheckbox.checked());

	const accCheckbox = createCheckbox('Accurate', ACCURATE).class('checkbox');
	accCheckbox.changed(() => ACCURATE = accCheckbox.checked());

	for (let i = 0; i < count; i++) {
		flock.push(new Agent());
	}
}

function draw() {
	background(64);

	aSliderValue = alignSlider.value();
	cSliderValue = cohesionSlider.value();
	sSliderValue = separationSlider.value();

	flock.forEach(agent => {
		agent.update();
	});

	if (DEBUG) {
		subdiv.getDebugGrid();
		subdiv.getNearItems(flock[0], true);
	}
}
