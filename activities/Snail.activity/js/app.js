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

  fractions: ['1/10', '1/9', '1/8', '1/7', '1/6','1/5','1/4','1/3','1/2'],

  // original 8 fluorescent crayons: https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors#Fluorescent_crayons
	//  "Ultra Red", "Ultra Orange", "Ultra Yellow","Chartreuse","Ultra Green","Ultra Blue","Ultra Pink","Hot Magenta"
  colors: ["253,91,120","255,96,55","255,153,102","255,255,102","102,255,102","80,191,230","255,110,255","238,52,210"],
  textColors:[],
  circles: [],
  selectedCircle: null,

  // Circle fake enumeration
  CIRCLE_STATE: {
    DEFAULT: 0,
    EXPLODING: 1,
    EXPLODED: 2,
  },

  GAME_STATE: {
    BEGIN: 0,
    DEFAULT: 1,
    END: 3,
  },

  init : function() {
    // Initialize properties
    this.canvas = document.querySelector('#mainCanvas');
    this.ctx = this.canvas.getContext('2d');

    // set the width and height
    this.canvas.width = 500;
    this.canvas.height = 800;

    this.gameState = this.GAME_STATE.DEFAULT;

    for(var x =0;x<this.colors.length;x++){
        this.textColors[x]=invertColor(this.colors[x]);
    }

    // make circles yo
    this.makeCircles(7,5);

    // set up events
    this.canvas.onmousedown = this.doMouseDown.bind(this);

    // start the game loop
    this.update();
  },

  // main update method
  update: function() {
    //clear
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    // 1) LOOP
		// schedule a call to update()
	 	this.animationId = requestAnimationFrame(this.update.bind(this));

	 	// 2) PAUSED?
	 	// if so, bail out of loop
    // TODO Add a paused state

    // 3) HOW MUCH TIME HAS GONE BY?
    this.dt = this.calculateDeltaTime();

    // 4) CIRCLES
    this.updateCircles();
  },

  moveCircles : function(dt) {
    for (let i = 0; i < this.circles.length; ++i) {
      for (let k = 0; k < this.circles[i].length; ++k) {
        const c = this.circles[i][k];
        if (c.state == this.CIRCLE_STATE.EXPLODED) continue;
  			c.move(dt);

        // if circle is leaving screen
        // if (this.circleHitBottom(c)) c.y = this.canvas.height - this.radius;
      }
		}
  },

  drawCircles: function(ctx) {
		for (let i = 0; i < this.circles.length; ++i) {
      for (let k = 0; k < this.circles[i].length; ++k) {
        const c = this.circles[i][k];
        if (c.state == this.CIRCLE_STATE.EXPLODED) continue;
  			c.draw(ctx);
      }
		}
	},

  updateCircles: function() {
    this.moveCircles(this.dt);
    // this.checkForCollisions();
    this.drawCircles(this.ctx);
  },

  circleHitBottom: function(c) {
    if (c.y > this.canvas.height - c.radius) {
      return true;
    }
  },

  checkForCollisions: function(){
		// check for collisions between circles
    for (let i = 0; i < this.circles.length; ++i) {
      for (let k = 0; k < this.circles[i].length; ++k) {
				var c1 = this.circles[i][k];
				// only check for collisions if c1 is exploding
				if (c1.state === this.CIRCLE_STATE.DEFAULT) continue;
        for (let j = 0; j < this.circles.length; ++j) {
          for (let l = 0; l < this.circles[j].length; ++l) {
  					var c2 = this.circles[j][l];
  				// don't check for collisions if c2 is the same circle
  					if (c1 === c2) continue;
  				// don't check for collisions if c2 is already exploding
  					if (c2.state != this.CIRCLE_STATE.DEFAULT ) continue;

  					// Now you finally can check for a collision
  					if(circlesIntersect(c1,c2) ){
  						c2.xSpeed = c2.ySpeed = 0;
  					}
          }
				}
      }
		} // end for
	},

  makeCircles : function(numRows, numPerRow) {
    const radius = 20;

    const totalWidthNeeded = numPerRow * 2 * radius; // number of circles * diameter
    const totalHeightNeeded = numRows * 2 * radius; // number of rows * diameter

    this.canvas.width = totalWidthNeeded;
    this.canvas.height = totalHeightNeeded;

    const xOffset = radius;
    const yOffset = radius;

    for (let i = 0; i < numPerRow; ++i) {
      let columns = [];

      for (let k = numRows - 1; k >= 0; --k) {
        //                            X X X X X X X
        //                            X X X X X X X
        //                            X X X X X X X
        //                            X X X X X X X
        // this is circles[0][0] ---> X X X X X X X

        let c = {};

        let move = function(dt) {
          console.log(this.ySpeed * this.speed * dt);
          this.y += this.ySpeed * this.speed * dt;
          console.log(this.y);
        };

        let draw = function(ctx) {
          ctx.save();

          // Create Red circle
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
          ctx.fill();

          // Draw the text on the circle
          // TODO There should be an inverse function so text is readable no matter the color
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.font="12px Arial"
          ctx.fillText(this.text, parseInt(this.x), parseInt(this.y)+6); // Add half the fontsize to center the text

          ctx.restore();
        }

        // Calculate x position
        c.x = xOffset + (radius * 2 * i);

        // Calculate y position
        c.y = yOffset + (radius * 2 * k);

        c.radius = radius;

        c.state = this.CIRCLE_STATE.DEFAULT;

        c.text = this.fractions[Math.floor((Math.random() * this.fractions.length))];

        c.fraction = fractionToDecimal(c.text);

        c.move = move;
        c.draw = draw;

        // Random Color
        c.color = `rgb(${this.colors[Math.floor((Math.random() * this.colors.length))]})`;

        c.speed = 80;
        c.xSpeed = 20;
        c.ySpeed = 80;

        columns.push(c);
      }

      this.circles.push(columns);
      columns = [];
    }
  },

  calculateDeltaTime: function(){
		let now,fps;
		now = performance.now();
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now;
		return 1/fps;
  },

  checkCircleClicked: function(mouse){
    // looping through circle array backwards
    for (let i = this.circles.length - 1; i >= 0; --i) {
      for (let k = this.circles[i].length - 1; k >= 0; --k) {
        let c = this.circles[i][k];
        if (pointInsideCircle(mouse.x, mouse.y, c)) {
          // We selected the second circle
          if (this.selectedCircle) {
            let c1 = this.selectedCircle;

            if (c.fraction == c1.fraction) {
              // circles are the same delete for now
              c.state = this.CIRCLE_STATE.EXPLODED;
              c1.state = this.CIRCLE_STATE.EXPLODED;
            }
            else {
              // Add them
              this.addCircles(c1, c);
            }

            this.selectedCircle = null;
          }
          else {
            this.selectedCircle = c;
          }
        }
      }
    }
  },
  doMouseDown: function(e){
      const mouse = getMouse(this.canvas, e);
      // have to call through app.main because this = canvas
      this.checkCircleClicked(mouse);
   },

  addCircles: function(c1, c2) {
    const fraction1 = c1.text.split("/");
    const fraction2 = c2.text.split("/");

    const numerator = parseInt(fraction1[0]) * parseInt(fraction2[1]) +
                        parseInt(fraction1[1]) * parseInt(fraction2[0]);
    const denominator = parseInt(fraction1[1]) * parseInt(fraction2[1]);

    const newFraction = reduce(numerator, denominator);

    c2.text = newFraction;
    c2.fraction = fractionToDecimal(newFraction);

    if (c2.fraction >= 1) c2.state = this.CIRCLE_STATE.EXPLODED;

    c1.state = this.CIRCLE_STATE.EXPLODED
  },
}; // end app.main
