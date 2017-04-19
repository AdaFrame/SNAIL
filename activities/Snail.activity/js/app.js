// app.js
// Dependencies:
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)

 */
app.main = {
  canvas: undefined,
  ctx: undefined,

  circles: [],

  // Circle fake enumeration
  CIRCLE_STATE: {
    DEFAULT: 0,
    EXPLODING: 1,
    EXPLODED: 2,
  },

  init : function() {
    // Initialize properties
    this.canvas = document.querySelector('#mainCanvas');
    this.ctx = this.canvas.getContext('2d');

    // set the width and height
    this.canvas.width = 500;
    this.canvas.height = 800;

    // make circles yo
    this.makeCircles(7,5);
    console.dir(this.circles);

    // start the game loop
    this.update();
  },

  // main update method
  update: function() {
    // 1) LOOP
		// schedule a call to update()
	 	this.animationId = requestAnimationFrame(this.update.bind(this));

    console.log('here');

	 	// 2) PAUSED?
	 	// if so, bail out of loop
    // TODO Add a paused state

    // 3) HOW MUCH TIME HAS GONE BY?
    this.dt = this.calculateDeltaTime();

    // 4) CIRCLES
    this.drawCircles(this.ctx);
  },

  Circle : function(x, y, radius, state, fraction, text, color) {
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.color = color;
    this.state = state;
    this.fraction = fraction;
    this.text = text;

    this.draw = draw.bind(this);
  },

  drawCircles: function(ctx) {
		for (let i = 0; i < this.circles.length; ++i) {
			const c = this.circles[i];
			if (c.state == this.CIRCLE_STATE.EXPLODED) continue;
			c.draw(ctx);
		}
	},

  makeCircles : function(numRows, numPerRow) {
    const radius = 20;
    const totalWidthNeeded = numPerRow * 2 * radius; // number of circles * diameter
    const xOffset = this.canvas.width / 2 - (totalWidthNeeded / 2) + radius;

    const totalHeightNeeded = numRows * 2 * radius; // number of rows * diameter
    const yOffset = this.canvas.height / 2 - (totalHeightNeeded / 2) + radius;

    for (let i = 0; i < numRows; ++i) {
      for (let k = 0; k < numPerRow; ++k) {
        // Calculate x position
        const x = xOffset + (radius * 2 * k);

        // Calculate y position
        const y = yOffset + (radius * 2 * i);
        
        const state = this.CIRCLE_STATE.DEFAULT;

        //TODO Hard coded for now but we should generate these
        //const fraction = .5;
        //const text = "1/2";
	const max = 10;
	const fraction = ((Math.floor((Math.random() * max)))+1);
	const text = ("1/" + fraction);

        const c = "rgb(255,0,0)";

        this.circles.push(new this.Circle(x, y, radius, state, fraction, text, c));
      }
    }
  },

  calculateDeltaTime: function(){
		var now,fps;
		now = performance.now();
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now;
		return 1/fps;
  },
}; // end app.main
