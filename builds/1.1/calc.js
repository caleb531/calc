/*!
Calc v1.1
Caleb Evans
Licensed under the MIT license
*/
(function(window, Math, parseFloat, parseInt, String, Object, Array, undefined) {

// Calc function
function Calc(input) {
	var obj = this;
	// Eliminate need to call "new"
	if (obj === window) {
		return new Calc(input);
	// If input is already wrapped
	} else if (input.constructor === Calc) {
		return input;
	}
	obj.value = input;
	obj.original = input;
	return this;
}

// Set variables (used as aliases)
var _Calc = window.Calc,
	abs = Math.abs,
	round = Math.round,
	floor = Math.floor,
	ceil = Math.ceil,
	pow = Math.pow,
	exp = Math.exp,
	log = Math.log,
	random = Math.random,
	toRad = 1,
	radic = '\u221a';
	
// Calc constants
Calc.PI = Math.PI;
Calc.E = Math.E;
Calc.PHI = (1 + pow(5, 0.5)) / 2;
Calc.G = 6.67e-11;

Calc.fn = Calc.prototype;
Calc.version = '1.1';

// Convert regular methods for the Calc function
function constructFn(name) {
	var fn = Calc[name];
	if (fn.call && !Calc.fn[name]) {
		// Map "this" with method's first argument
		Calc.fn[name] = function() {
			var args = Array.prototype.slice.call(arguments, 0);
			this.value = fn.apply(this, [this.value].concat(args));
			return this;
		};
	}
}

// Make all methods chainable
function makeChainable(name) {
	var p;
	// Apply to only a single method if specified
	if (name !== undefined) {
		return constructFn(name);
	// Else, apply to all methods
	} else {
		for (p in Calc) {
			if (Calc.hasOwnProperty(p)) {
				constructFn(p);
			}
		}
	}
}

// Extend Calc
Calc.extend = function(name, fn) {
	Calc[name] = fn;
	makeChainable(name);
	return fn;
};

// Revert to original input
Calc.fn.end = function() {
	this.value = this.original;
	return this;
};

// Prevent naming conflicts
Calc.noConflict = function() {
	if (window.Calc === Calc) {
		window.Calc = _Calc;
	}
	return Calc;
};

// Convert degrees to radians
Calc.useDegrees = function(value) {
	if (value || value === undefined) {
		toRad = Math.PI / 180;
	} else {
		toRad = 1;
	}
	return Calc;
};

// useDegrees() method for chaining
Calc.fn.useDegrees = function(value) {
	Calc.useDegrees(value);
	return this;
};

/*** Number module ***/

Calc.abs = abs;
Calc.ceil = ceil;
Calc.floor = floor;
Calc.round = function(num, places) {
	return places ? parseFloat(num.toFixed(places)) : round(num);
};

// Round to nearest n
Calc.nearest = function(num, n) {
	n = n || 1;
	return round(num / n) * n;
};

// Chop off decimal (different than floor)
Calc.chop = function(num) {
	return num - (num % 1);
};

// Return 1, -1, or 0 (based on a number's sign)
Calc.sign = function(num) {
	var sign;
	if (num > 0) {
		sign = 1;
	} else if (num < 0) {
		sign = -1;
	} else {
		sign = 0;
	}
	return sign;
};

// Fix binary rounding error
Calc.correct = function(num) {
	if (String(num).indexOf('e') === -1 && Calc.round(num, 14) === Calc.round(num, 13)) {
		num = Calc.round(num, 14);
	}
	return num;
};

/*** Exponent module ***/

Calc.pow = function(base, exp) {
	if (exp === undefined) {exp = 2;}
	return pow(base, exp);
};
Calc.root = function(base, root) {
	if (root === undefined) {root = 2;}
	return pow(base, 1/root);
};
Calc.log = function(num, base) {
	if (base === undefined) {base = 10;}
	return log(num) / log(base);
};
Calc.ln = log;
Calc.exp = exp;

// Solve quadratic equation
Calc.quad = function(a, b, c) {
	var discr = pow(b, 2) - (4*a*c),
		ans = null;
	// If answers are real
	if (discr > 0) {
		ans = [
			(-b + pow(discr, 0.5)) / (2*a),
			(-b - pow(discr, 0.5)) / (2*a)
		];
	// If only one answer
	} else if (discr === 0) {
		ans = (-b + pow(discr, 0.5)) / (2*a);
	} else {
		ans = null;
	}
	return ans;
};

/*** Statistic module ***/

Calc.sort = function(list, fn) {
	list = list.slice(0);
	if (fn && fn.call) {
		list.sort(function(a, b) {
			return fn(a) - fn(b);
		});
	} else {
		list.sort(function(a, b) {
			return a - b;
		});
	}
	return list;
};
Calc.min = function(list) {
	if (!list.length) {list = [0];}
	return Math.min.apply(Math, list);
};
Calc.max = function(list) {
	return Math.max.apply(Math, list);
};
Calc.range = function(list) {
	return Calc.max(list) - Calc.min(list);
};
// Generate a list of numbers through a certain range
Calc.thru = function(start, end, step) {
	var arr = [], i;
	// If no starting number is specified
	if (end === undefined) {
		end = start;
		start = 0;
	}
	// If step is 0 or undefined
	if (!step) {step = 1;}
	// If step is positive
	if (start < end) {
		for (i=start; i<end+1; i+=step) {
			arr.push(i);
		}
	// If step is negative
	} else {
		for (i=start; i>end; i+=step) {
			arr.push(i);
		}
	}
	return arr;
};
Calc.sum = function(list) {
	var sum = 0, i;
	for (i=0; i<list.length; i+=1) {
		sum += list[i];
	}
	return sum;
};
Calc.product = function(list) {
	var prod = 1, i;
	for (i=0; i<list.length; i+=1) {
		prod *= list[i];
	}
	return prod;
};
Calc.mean = function(list) {
	return Calc.sum(list) / list.length;
};
Calc.geoMean = function(list) {
	return pow(Calc.product(list), 1/list.length);
};
Calc.median = function(list) {
	var med, m1, m2;
	list = Calc.sort(list);
	// If list has no true median
	if (list.length % 2 === 0) {
		m1 = list[list.length/2 - 1];
		m2 = list[list.length/2];
		med = Calc.mean([m1, m2]);
	// But if it does...
	} else {
		med = list[floor(list.length/2)];
	}
	return med;
};
Calc.modes = function(list) {
	var map = [],
		modes = [],
		maxCount = 1,
		item, i;
	for (i=0; i<list.length; i+=1) {
		item = list[i];
		if (map[item] === undefined) {
			map[item] = 1;
		} else {
			map[item]++;  
		}
		if (map[item] > maxCount) {
			modes = [item];
			maxCount = map[item];
		} else if (map[item] === maxCount) {
			modes.unshift(item);
			maxCount = map[item];
		}
	}
	if (modes.join() === list.join()) {
		modes = [];
	}
	return modes;
};
Calc.variance = function(list, pop) {
	var n = list.length,
		mean = Calc.mean(list),
		top = 0,
		inside, i;
	for (i=0; i<list.length; i+=1) {
		top += pow(list[i]-mean, 2);
	}
	// If population is chosen
	if (pop) {
		inside = top / n;
	} else {
		inside = top / (n - 1);
	}
	return inside;
};
Calc.stdDev = function(list, pop) {
	return pow(Calc.variance(list, pop), 0.5);
};

/*** Geometry module ***/

Calc.slope = function(pt1, pt2) {
	var slope = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
	if (slope === Infinity) {slope = null;}
	return slope;
};
Calc.dist = function(pt1, pt2) {
	return pow(
		pow(pt2[0] - pt1[0], 2) + pow(pt2[1]- pt1[1], 2),
	0.5);
};
Calc.midpt = function(pt1, pt2) {
	return [
		(pt1[0] + pt2[0]) / 2,
		(pt1[1] + pt2[1]) / 2
	];
};
Calc.hypot = function(a, b) {
	return pow(pow(a, 2) + pow(b, 2), 0.5);
};

/*** Combinatorics module ***/

Calc.factorial = function(num) {
	var factorial = num, i;
	if (num === 0) {
		factorial = 1;
	} else if (num < 0) {
		factorial = null; 
	} else if (num % 1 === 0) {
		for (i=1; i<num; i+=1) {
			factorial *= i;
		}
	}
	return factorial;
};
Calc.nPr = function(n, r) {
	if (n < r || !r) {return 0;}
	return Calc.factorial(n) / Calc.factorial(n - r);
};
Calc.nCr = function(n, r) {
	if (n < r || !r) {return 0;}
	return Calc.factorial(n) / (Calc.factorial(n - r) * Calc.factorial(r));
};

/*** Trigonometry module ***/

// Convert angle to radian notation
Calc.radians = function(angle) {
	angle = angle || 0;
	// Convert to degrees
	if (toRad === 1) {
		angle /= Math.PI / 180;
	}
	var parts = Calc.frac(abs(angle) / 180).split('/'),
		sign = '';
	// Remove "1" from numerator
	if (parts[0] === '1') {
		parts[0] = '';
	} else if (parts[0] === '0') {
		return '0';
	}
	// Remove "1" from denominator
	if (!parts[1] || parts[1] === '1') {
		parts[1] = '';
	} else {
		parts[1] = '/' + parts[1];
	}
	// Respect negativity
	if (angle < 0) {parts[0] = '-' + parts[0];}
	return parts[0] + '\u03c0' + parts[1];
};

// Trig functions
Calc.sin = function(angle) {
	return Math.sin(angle * toRad);
};
Calc.cos = function(angle) {
	return Math.cos(angle * toRad);
};
Calc.tan = function(angle) {
	return Math.tan(angle * toRad);
};
Calc.asin = function(num) {
	return Math.asin(num) / toRad;
};
Calc.acos = function(num) {
	return Math.acos(num) / toRad;
};
Calc.atan = function(num) {
	return Math.atan(num) / toRad;
};
Calc.atan2 = function(num1, num2) {
	return Math.atan2(num1, num2) / toRad;
};

// Hyperbolic functions
Calc.sinh = function(angle) {
	angle *= toRad;
	return (exp(angle) - exp(-angle)) / 2;
};
Calc.cosh = function(angle) {
	angle *= toRad;
	return (exp(angle) + exp(-angle)) / 2;
};
Calc.tanh = function(angle) {
	angle *= toRad;
	return (exp(angle) - exp(-angle)) / (exp(angle) + exp(-angle));
};
Calc.asinh = function(num) {
	return log(num + pow((num*num + 1), 0.5)) / toRad;
};
Calc.acosh = function(num) {
	return log(num + pow((num*num - 1), 0.5)) / toRad;
};
Calc.atanh = function(num) {
	return log((1 + num) / (1 - num)) / 2 / toRad;
};

/*** Factor module ***/

// Get factors
Calc.factors = function(list) {
	// Create and clone list
	if (!list || !list.splice) {
		list = [list];
	} else {
		list = list.slice(0);
	}
	var matching, min,
		factors = [1],
		f, i;
	
	// Deal with positive numbers only
	for (i=0; i<list.length; i+=1) {
		list[i] = abs(list[i]);
		// Eliminate zeroes
		if (!list[i]) {list.splice(i, 1);}
	}
	
	min = Calc.min(list);
		
	// Loop through all possible factors
	for (f=2; f<=min; f+=1) {
		matching = 0;
		for (i=0; i<list.length; i++) {
			// If number is a factor
			if (list[i] % f === 0) {
				matching += 1;
			}
		}
		// If number is a common factor
		if (matching === list.length) {
			factors.push(f);
		}
	}
	return factors;
};
// Get greatest common factor
Calc.gcf = function(list) {
	var factors = Calc.factors(list);
	return factors[factors.length-1];
};

// Get least common multiple
Calc.lcm = function(list) {
	var prod, lcm, matching, m, i;
	prod = 1;
	m = 1;

	// Create and clone list
	list = list.slice(0);

	// Loop through all possible multiples
	while (true) {
		matching = 0;
		for (i=0; i<list.length; i+=1) {
			// If number is multiple
			if (m % list[i] === 0) {
				matching += 1;
			}
		}
		// If multiple is a multiple of all given numbers
		if (matching === list.length) {
			lcm = m;
			break;
		}
		m += 1;
	}	
	return lcm;
};

// Get Fibonacci numbers through index n
Calc.fib = function(n) {
	var seq = [0, 1],
		last, total = 1, i;
	if (n === 0) {return 0;}
	// Loop through sequence
	for (i=0; i<n-1; i+=1) {
		last = seq[1];
		total = seq[0] + last;
		seq = [last, total];
	}
	return total;
};

/*** Representation module ***/

// Convert to fraction
Calc.frac = function(num) {
	var dec = 1,
		top = 1,
		bot = 1,
		i = 0,
		negative;
	
	num = Calc.correct(num);
	
	// If number is negative
	if (num < 0) {
		num = abs(num);
		negative = true;
	}

	while (dec !== num) {
		if (i < 100000) {
			if (dec < num) {
				top += 1;
			} else {
				bot += 1;
				top = floor(num * bot);
			}
			dec = top / bot;
			i += 1;
		} else {
			return String(num);
		}
	}
	// If 0 or negative
	if (top === 0) {
		top = 0;
		bot = 1;
	} else if (negative) {
		top *= -1;
	}
	return top + '/' + bot;
};

// Simplify radical
Calc.radical = function(num) {
	var root, imaginary, i,
		factor, ans;

	// If number is imaginary
	if (num < 0) {
		imaginary = true;
		num = abs(num);
	}
	root = pow(num, 0.5);
	
	// If answer is not an integer
	if (num % 1 !== 0) {
		ans = '(' + Calc.frac(num) + ')';
	} else {
		ans = num;
	}
	ans = radic + ans;

	// If perfect square
	if (root % 1 === 0) {
		ans = String(root);
	} else {
		// Find factors of number
		for (i=2; i<num; i+=1) {
			// If number is factor
			factor = num/i;
			if (factor % 1 === 0) {
				root = pow(factor, 0.5);
				// If factor is perfect square
				if (root % 1 === 0) {
					ans = [root, num/factor].join(radic);
					break;
				}
			}
		}
	}
	
	// If imaginary
	if (imaginary) {
		if (ans.indexOf(radic) !== -1) {
			ans = ans.replace(/\u221a/gi, 'i√');
		} else {
			ans += 'i';
		}
	}
	return ans;
};

// Convert number to comma-separated string
Calc.commas = function(num) {
	var parts = String(num).split('.');
	parts[0] = parts[0]
		.split('')
		.reverse()
		.join('')
		.replace(/(\d{3})/gi, '$1,')
		.replace(/\,$/gi, '')
		.split('')
		.reverse()
		.join('');
	return parts.join('.');
};

// Convert string to number (and remove commas)
Calc.num = function(num) {
	var parts = String(num)
		.replace(/,/gi, '')
		.split('/');
	num = String(parts[0] / (parts[1] || 1));
	return parseFloat(num);
};

/*** Condition module ***/

Calc.isEven = function(num) {
	return (num % 2 === 0);
};
Calc.isOdd = function(num) {
	return (num % 2 === 1);
};
Calc.isInteger = function(num) {
	return (num % 1 === 0);
};
Calc.isPrime = function(num) {
	var factors = Calc.factors(num);
	return (factors[1] === abs(num));
};
Calc.isComposite = function(num) {
	num = abs(num);
	return (num !== 0 && num !== 2 && Calc.factors(num).length > 2);
};
Calc.isFactor = function(factor, num) {
	return (num % factor === 0);
};
// If number is in Fibonacci sequence
Calc.isFib = function(num) {
	var seq = [0, 1],
		last, total, ans = false, i;
	if (num === 0 || num === 1) {ans = true;}
	// Loop through sequence
	for (i=0; i<num-1; i+=1) {
		last = seq[1];
		total = seq[0] + last;
		seq = [last, total];
		if (seq[1] === num) {
			ans = true;
			break;
		}
	}
	return ans;
};

/* Random Module */

// Get random number or list index
Calc.random = function(a, b) {
	if (a === undefined && b === undefined) {
		a = 0;
		b = 1;
	} else if (a === undefined) {
		a = 0;
	}
	if (a.splice) {
		return floor(a.length * random());
	} else if (b === undefined) {
		b = a;
		a = 0;
	}
	return a + (b - a) * random();
};
// Scramble a list of numbers
Calc.scramble = function(list) {
	var item, i;
	list = list.slice(0);
	for (i=0; i<list.length; i+=1) {
		item = list[i];
		list.splice(i, 1);
		list.splice(Calc.random(list), 0, item);
	}
	return list;
};
// Get a random selection from a list
Calc.choices = function(list, n) {
	return Calc.scramble(list).slice(0, n || 1);
};
// Get a random number from a list
Calc.choice = function(list, n) {
	return Calc.scramble(list)[0];
};

/* Base module */

Calc.dec = function(num, base) {
	return parseInt(num, base);
};
Calc.bin = function(num, base) {
	num = parseInt(num, base);
	return num.toString(2);
};
Calc.oct = function(num, base) {
	num = parseInt(num, base);
	return num.toString(8);
};
Calc.hex = function(num, base) {
	num = parseInt(num, base);
	return num.toString(16);
};

// Make all methods chainable
makeChainable();

window.Calc = Calc;
}(window, Math, parseFloat, parseInt, String, Object, Array));