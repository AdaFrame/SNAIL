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

function fractionToDecimal(fraction) {
  const splitText = fraction.split('/');
  return parseInt(splitText[0]) / parseInt(splitText[1]);
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

// http://courses.washington.edu/css161/zander/Code/Fraction.java
function reduce(numerator, denominator) {
  // find the larger of the numerator and denominator
  let n = numerator, d = denominator, largest;
  if (numerator < 0) {
      n = -numerator;
  }
  console.log(n);
  if (n > d) {
      largest = n;
  }
  else {
      largest = d;
  }

  // find the largest number that divide the numerator and
  // denominator evenly
  let gcd = 0;
  for (let i = largest; i >= 2; i--) {
      if (numerator % i == 0 && denominator % i == 0) {
          gcd = i;
          break;
      }
  }

  // divide the largest common denominator out of numerator, denominator
  if (gcd != 0) {
      numerator /= gcd;
      denominator /= gcd;
  }

  return numerator + '/' + denominator;
}
