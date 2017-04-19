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

  circles: [],
  circlesClicked: [],

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
    this.canvas.onmousedown = this.doMousedown;

    // set the width and height
    this.canvas.width = 500;
    this.canvas.height = 800;

    // make circles yo
    this.makeCircles(7,5);

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

        const text = this.fractions[Math.floor((Math.random() * this.fractions.length))];
        const fraction = parseInt(text);

        // Random Color
        console.log(Math.floor((Math.random() * this.colors.length)));
        const c = `rgb(${this.colors[Math.floor((Math.random() * this.colors.length))]})`;

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
    checkCircleClicked: function(mouse){
        // looping through circle array backwards
        for(var i = this.circles.length -1; i>=0; i--){
            var c = this.circles[i];
            if (pointInsideCircle(mouse.x, mouse.y, c)){
                //do something with circle here
                if(circlesClicked.length == 2) {
                    //now do we add them or go boom?
                    if(circlesClicked[0].fraction==c.fraction){
                        //delete them and add points?

                        var index = circles.indexOf(circlesClicked[0]);
                        c.state=this.CIRCLE_STATE['EXPLODED'];
                        circlesClicked[0].state = this.CIRCLE_STATE['EXPLODED'];

                        this.circles[i]=c;
                        this.circles[index]=circlesClicked[0];

                        circlesClicked = [];
                    }else{
                        //add 1st circle into the 2nd one.
                        this.addCircles(circlesClicked[0],c);

                        //get rid of first one
                        var index = circles.indexOf(circlesClicked[0]);
                        circlesClicked[0].state = this.CIRCLE_STATE['EXPLODED'];
                        this.circles[index]=circlesClicked[0];

                        circlesClicked=[];
                    }
                }else{
                    //perhaps create some highlight around the circle to show it is selected?
                    circlesClicked.push(c);
                }
                break; // we want to do only one circle
            }
        }
    },
  doMouseDown: function(e){
      var mouse = getMouse(e);
      // have to call through app.main because this = canvas
      app.main.checkCircleClicked(mouse);
   },

}; // end app.main
