/*!
Calc v1.0b
Caleb Evans
Licensed under the MIT license
*/
(function(window, Math, parseFloat, String, Object, Array, undefined) {

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
	obj.original = input;
	obj[0] = input;
	return this;
}

// Set variables (used as aliases)
var _Calc = window.Calc,
	abs = Math.abs,
	round = Math.round,
	floor = Math.floor,
	ceil = Math.ceil,
	pow = Math.pow,
	log = Math.log,
	toRad;
	
// Calc properties
Calc.pi = Math.PI;
Calc.e = Math.E;
Calc.inDegrees = false;
Calc.fn = Calc.prototype;

// Convert regular methods for the Calc function
function constructFn(name) {
	var fn = Calc[name];
	if (typeof fn === 'function') {
		// Map "this" with method's first argument
		Calc.fn[name] = function() {
			var args = Array.prototype.slice.call(arguments, 0);
			this[0] = fn.apply(this, [this[0]].concat(args));
			return this;
		};
	}
}

// Make all methods chainable
function makeChainable(name) {
	// Apply to only a single method if specified
	if (name !== undefined) {
		return constructFn(name);
	// Else, apply to all methods
	} else {
		for (var p in Calc) {
			if (!Calc.fn[p]) {
				constructFn(p);
			}
		}
	}
}
// Revert to original input
Calc.fn.end = function() {
	this[0] = this.original;
	return this;
};

// Extend Calc
Calc.extend = function(name, fn) {
	Calc[name] = fn;
	makeChainable(name);
	return Calc;
};

// Prevent naming conflicts
Calc.noConflict = function() {
	if (window.Calc === Calc) {
		window.Calc = _Calc;
	}
	return Calc;
};

// Convert degrees to radians
function convertAngles(newValue) {
	if (newValue) {
		toRad = Math.PI / 180;
	} else {
		toRad = 1;
	}
	return newValue;
}

// Detect when a property changes
function watch(obj, prop, callback) {
	var op = Object.prototype,
		define = Object.defineProperty,
		value = obj[prop];
	// Set property value
	function getter() {
		return value;
	}
	function setter(newValue) {
		return (value = callback.call(obj, newValue));
	}
	// If defineProperty is supported
	if (define) {
		define(obj, prop, {
			get: getter,
			set: setter
		});
	// If not supported
	} else {
		Object.prototype.__defineGetter__.call(this, prop, getter);
		Object.prototype.__defineSetter__.call(this, prop, setter);
	}
}

/*** General operations ***/

Calc.abs = abs;
Calc.ceil = ceil;
Calc.floor = floor;
Calc.round = round;

// Round to n places
Calc.places = function(num, places) {
	if (places === undefined) {places = 2;}
	return parseFloat(num.toFixed(places));
};
// Chop off decimal (different than floor)
Calc.chop = function(num) {
	return num | 0;
};
// Get random number/index
Calc.random = function(a, b) {
	var type = typeof a;
	if (type !== 'number') {
		if (type === 'object') {return (a.length * Math.random()) | 0;}
		a = 0;
		b = 1;
	}
	return a + (b - a) * Math.random();
};

/*** Exponents ***/

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
Calc.ln = function(num) {
	return log(num);
};

/*** Statistics ***/

Calc.sort = function(list, desc) {
	list = list
		.slice(0)
		.sort(function(a, b) {
			return a - b;
		});
	// Sort descending if chosen
	if (desc) {list.reverse();}
	return list;
};
Calc.min = function(list) {
	return Math.min.apply(Math, list);
};
Calc.max = function(list) {
	return Math.max.apply(Math, list);
};
Calc.range = function(list) {
	return Calc.max(list) - Calc.min(list);
};
Calc.sum = function(a, b) {
	// If b exists, use summation
	if (b !== undefined) {
		return (b-a+1)/2 * (a + b);
	}
	var sum = 0, i = a.length;
	while (i--) {
		sum += a[i];
	}
	return sum;
};
Calc.product = function(list) {
	var prod = list[0],
		i = list.length;
	while (--i) {
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
		med = list[(list.length/2) | 0];
	}
	return med;
};
Calc.modes = function(list) {
	var map = [],
		modes = [],
		maxCount = 1,
		i = list.length,
		item;
	while (i--) {
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
			modes.splice(0, 0, item);
			maxCount = map[item];
		}
	}
	if (modes.join() === list.join()) {
		modes = null;
	}
	return modes;
};
Calc.variance = function(list, pop) {
	var n = list.length,
		mean = Calc.mean(list),
		top = 0,
		inside, i = n;
	list = Calc.sort(list);
	while (i--) {
		top += pow(list[i]-mean, 2);
	}
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

/*** Geometry ***/

Calc.slope = function(pt1, pt2) {
	var slope = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
	if (slope === Infinity) {slope = null;}
	return slope;
};
Calc.dist = function(pt1, pt2) {
	return pow(
		pow(pt2[0]-pt1[0], 2) + pow(pt2[1]-pt1[1], 2),
	0.5);
};
Calc.midpt = function(pt1, pt2) {
	return [
		(pt1[0]+pt2[0]) / 2,
		(pt1[1]+pt2[1]) / 2
	];
};
Calc.pythag = function(sides) {
	var missing;
	if (sides.c === undefined) {
		missing = pow(pow(sides.a, 2) + pow(sides.b, 2), 0.5);
	} else if (sides.b === undefined) {
		missing = pow(pow(sides.c, 2) - pow(sides.a, 2), 0.5);
	} else if (sides.a === undefined) {
		missing = pow(pow(sides.c, 2) - pow(sides.b, 2), 0.5);
	}
	return missing;
};
Calc.hypot = function(a, b) {
	return pow(pow(a, 2) + pow(b, 2), 0.5);
};

/*** Combinatorics ***/

Calc.factorial = function(num) {
	var factorial = num;
	if (num === 0) {
		factorial = 1;
	} else if (num < 0) {
		factorial = null; 
	} else if (num % 1 === 0) {
		while (--num) {
			factorial *= num;
		}
	}
	return factorial;
};
Calc.nPr = function(n, r) {
	return Calc.factorial(n) / Calc.factorial(n - r);
};
Calc.nCr = function(n, r) {
	return Calc.factorial(n) / (Calc.factorial(n - r) * Calc.factorial(r));
};

/*** Trigonometry ***/

// Convert angle to radian notation
Calc.radians = function(angle) {
	angle *= toRad;
	var frac = Calc.frac(abs(angle * 180 / Calc.pi) / 180).split('/'),
		sign = '';
	// Remove "1" from numerator
	if (frac[0] === '1') {
		frac[0] = '';
	} else if (frac[0] === '0') {
		return '0';
	}
	// Remove "1" from denominator
	if (frac[1] === '1') {
		frac[1] = '';
	} else {
		frac[1] = '/' + frac[1];
	}
	// Respect negativity
	if (angle < 0) {frac[0] = '-' + frac[0];}
	return frac[0] + 'π' + frac[1];
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

/*** Factors ***/

// Get factors
Calc.factors = function(list) {
	if (!list.slice) {list = [list];}
	var min,
		factors = [1],
		matching, n = list.length, f;
	list = list.slice(0);
	
	// Deal with positive numbers only
	while (n--) {
		if (list[n] < 0) {
			list[n] *= -1;
		}
	}
	n = list.length;
	min = Calc.min(list);
		
	// Loop through all possible factors
	for (f=2; f<=min; f+=1) {
		matching = 0;
		while (n--) {
			// If number is a factor
			if (list[n] % f === 0) {
				matching += 1;
			}
		}
		n = list.length;
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

// Get factors pairs of number
Calc.factorPairs = function(num) {
	var factors = Calc.factors(num),
		pairs = [], factor, f;
	for (f=0; f<factors.length; f+=1) {
		factor = factors[f];
		pairs.push([factor, num/factor]);
		pairs.push([-factor, -num/factor]);
	}
	return pairs;
};

// Get least common multiple
Calc.lcm = function(list) {
	list = Calc.sort(list);
	var prod = Calc.product(list),
		lcm, matching, n, m;
	// Loop through all possible multiples
	for (m=list[0]; m<=prod; m+=1) {
		matching = 0;
		for (n=0; n<list.length; n+=1) {
			// If number is multiple
			if (m % list[n] === 0) {
				matching += 1;
			}
		}
		if (matching === list.length) {
			lcm = m;
			break;
		}
	}	
	return lcm;
};

// Get Fibonacci numbers through n
Calc.fib = function(n) {
	var seq = [0], i;
	if (n > 1) {seq.push(1);}
	for (i=2; i<n; i+=1) {
		seq.push(seq[i-1] + seq[i-2]);
	}
	return seq;
}

/*** Conversions ***/

// Convert to fraction
Calc.frac = function(num) {
	var dec = 1,
		top = 1,
		bot = 1,
		negative = (num < 0 ? true : false);
	num = abs(num);

	while (dec !== num) {
		if (dec < num) {
			top += 1;
		} else {
			bot += 1;
			top = (num * bot) | 0;
		}
		dec = top / bot;
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

	var route, imaginary, i,
		factor, parts = [], ans;

	// If number is imaginary
	if (num < 0) {
		imaginary = true;
		num *= -1;
	}
	route = pow(num, 0.5);
	ans = '√' + num;

	// If perfect square
	if (route % 1 === 0) {
		ans = String(route);
	} else {
		// Find factors of number
		for (i=1; i<num; i+=1) {
			// If number is factor
			factor = num/i;
			if (factor % 1 === 0) {
				route = pow(factor, 0.5);
				// If factor is perfect square
				if (route % 1 === 0) {
					ans = [route, num/factor].join('√');
					break;
				}
			}
		}
	}
	// If imaginary
	if (imaginary) {
		if (ans.indexOf('√') !== -1) {
			ans = ans.replace(/√/gi, 'i√');
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
	var parts = String(num).split('/');
	num = String(parts[0] / (parts[1] || 1));
	return parseFloat(num.replace(/,/gi, ''));
};

/*** Conditions ***/

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
	if (num < 0) {num *= -1;}
	var factors = Calc.factors(num);
	return (factors[1] === num);
};
Calc.isComposite = function(num) {
	if (num < 0) {num *= -1;}
	return (num !== 0 && num !== 2 && num % 2 === 0);
}
Calc.isFactor = function(factor, num) {
	return (num % factor === 0);
};
// If number is in Fibonacci sequence
Calc.isFib = function(num) {
	var seq = [0, 1],
		ans = false, i;
	if (num === 0 || num === 1) {
		ans = true;
	} else {
		for (i=2; i<=num+1; i+=1) {
			seq.push(seq[i-1] + seq[i-2]);
			if (seq[seq.length-1] === num) {
				ans = true;
				break;
			}
		}
	}
	return ans;
};

makeChainable();
// Detect degrees/radians change
convertAngles();
watch(Calc, 'inDegrees', convertAngles);

window.Calc = window.Calc = Calc;
}(window, Math, parseFloat, String, Object, Array));