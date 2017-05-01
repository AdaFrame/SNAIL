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
  ctx.strokeStyle = this.strokeColor;
  ctx.stroke();
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

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb2hex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hex2rgb(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
}

function invertColor(rgb){
    var rgbArray = rgb.split(",");
    var hex = rgb2hex(rgb[0],rgb[1],rgb[2]);
    /*var color = hex;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #*/

    var color = hexToComplimentary(hex);

    var rgbOutput = hex2rgb(color);

    var rgbString = "" + rgbOutput.r + ","+rgbOutput.g + "," + rgbOutput.b;
    return rgbString
}
function hexToComplimentary(hex){

    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16);
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
}
