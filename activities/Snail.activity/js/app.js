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
  anvas: undefined,
  ctx: undefined,

  init : function() {
    // Initialize properties
    this.canvas = document.querySelector('#mainCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.drawCircle(this.ctx, this.canvas.width/2, this.canvas.height/2, 20, 1/2);

    console.log('Hello World');
  },

  drawCircle : function(ctx, x, y, radius, fraction) {
    // Create Red circle
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.fill();

    // Draw the text on the circle
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font="12px Arial"
    ctx.fillText("1/2",x,y+6); // Add half the fontsize to center the text
  },
}; // end app.main
