function draw(ctx) {
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
  ctx.fillText(this.text, this.x, this.y+6); // Add half the fontsize to center the text

  ctx.restore();
}

/*
Function Name: clamp(val, min, max)
Author: Web - various sources
Return Value: the constrained value
Description: returns a value that is
constrained between min and max (inclusive)
*/
function clamp(val, min, max){
	return Math.max(min, Math.min(max, val));
}

function getMouse(canvas, e){
    var rect = canvas.getBoundingClientRect();

    let mouse = {};
    mouse.x = e.pageX - rect.left;
    mouse.y = e.pageY - rect.top;
    return mouse;
}
function pointInsideCircle(x, y, I) {
    var dx = x - I.x;
    var dy = y - I.y;
    return dx * dx + dy * dy <= I.radius * I.radius;
}
