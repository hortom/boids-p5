# Boids - Flocking Simulation

This implementation is based on Daniel Shiffman's CodingTrain [video](https://www.youtube.com/watch?v=mhjuuHl6qHM).
  
There are some minor optimisations to get a higher number (1000+) agents to be handeld.
* Avoid to create new Vector object if possibble.
* Avoid `sqrt` calculation when possible.
* Cache distance values.
* After a certain amount of nearby agent, just 100 (`maxNearCount`) are used to calculate the alignment, cohesion and separation. Statistically, it should be ok.
  
The used [p5.js](https://p5js.org/) renderer is also has some limitation so we can't go over 1500 agents on a retina display. But it is perfect for such an experiment like this.
