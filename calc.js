/*!
Calc v1.0b
Caleb Evans
Licensed under the MIT license
*/
(function(window, Math, Object, parseFloat, Object, Array, String, undefined) {

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
var C = Calc,
	_C = window.C,
	_Calc = window.Calc,
	abs = Math.abs,
	round = Math.round,
	floor = Math.floor,
	ceil = Math.ceil,
	pow = Math.pow,
	log = Math.log,
	toRad;
	
// Calc properties
C.pi = Math.PI;
C.e = Math.E;
C.inDegrees = false;
C.fn = C.prototype;

// Convert regular methods for the Calc function
function constructFn(name) {
	var fn = C[name];
	if (typeof fn === 'function') {
		// Map "this" with method's first argument
		C.fn[name] = function() {
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
		for (var p in C) {
			if (!C.fn[p]) {
				constructFn(p);
			}
		}
	}
};
// Revert to original input
C.fn.end = function() {
	this[0] = this.original;
	return this;
};

// Extend Calc
C.extend = function(name, fn) {
	C[name] = fn;
	makeChainable(name);
	return C;
};

// Prevent naming conflicts
C.noConflict = function(deep) {
	if (window.C === C) {
		window.C = _C;
	}
	if (deep && window.Calc === Calc) {
		window.Calc = _Calc;
	}
	return C;
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

C.abs = abs;
C.ceil = ceil;
C.floor = floor;
C.round = round;

// Round to n places
C.places = function(num, places) {
	if (places === undefined) {places = 2;}
	return parseFloat(num.toFixed(places));
};
// Chop off decimal (different than floor)
C.chop = function(num) {
	return num | 0;
};
// Get random number/index
C.random = function(a, b) {
	var type = typeof a;
	if (type !== 'number') {
		if (type === 'object') {return (a.length * Math.random()) | 0;}
		a = 0;
		b = 1;
	}
	return a + (b - a) * Math.random();
};

/*** Exponents ***/

C.pow = function(base, exp) {
	if (exp === undefined) {exp = 2;}
	return pow(base, exp);
};
C.root = function(base, root) {
	if (root === undefined) {root = 2;}
	return pow(base, 1/root);
};
C.log = function(num, base) {
	if (base === undefined) {base = 10;}
	return log(num) / log(base);
};
C.ln = function(num) {
	return log(num);
};

/*** Statistics ***/

C.sort = function(list, desc) {
	list = list
		.slice(0)
		.sort(function(a, b) {
			return a - b;
		});
	// Sort descending if chosen
	if (desc) {list.reverse();}
	return list;
};
C.min = function(list) {
	return Math.min.apply(Math, list);
};
C.max = function(list) {
	return Math.max.apply(Math, list);
};
C.range = function(list) {
	return C.max(list) - C.min(list);
};
C.sum = function(a, b) {
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
C.product = function(list) {
	var prod = list[0],
		i = list.length;
	while (i-=1) {
		prod *= list[i];
	}
	return prod;
};
C.mean = function(list) {
	return C.sum(list) / list.length;
};
C.geoMean = function(list) {
	return pow(C.product(list), 1/list.length);
};
C.median = function(list) {
	var med, m1, m2;
	list = C.sort(list);
	// If list has no true median
	if (list.length % 2 === 0) {
		m1 = list[list.length/2 - 1];
		m2 = list[list.length/2];
		med = C.mean([m1, m2]);
	// But if it does...
	} else {
		med = list[(list.length/2) | 0];
	}
	return med;
};
C.modes = function(list) {
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
C.variance = function(list, pop) {
	var n = list.length,
		mean = C.mean(list),
		top = 0,
		inside, i = n;
	list = C.sort(list);
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
C.stdDev = function(list, pop) {
	return pow(C.variance(list, pop), 0.5);
};

/*** Geometry ***/

C.slope = function(pt1, pt2) {
	var slope = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
	if (slope === Infinity) {slope = null;}
	return slope;
};
C.dist = function(pt1, pt2) {
	return pow(
		pow(pt2[0]-pt1[0], 2) + pow(pt2[1]-pt1[1], 2),
	0.5);
};
C.midpt = function(pt1, pt2) {
	return [
		(pt1[0]+pt2[0]) / 2,
		(pt1[1]+pt2[1]) / 2
	];
};
C.pythag = function(sides) {
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
C.hypot = function(a, b) {
	return pow(pow(a, 2) + pow(b, 2), 0.5);
};

/*** Combinatorics ***/

C.factorial = function(num) {
	var factorial = num;
	if (num === 0) {
		factorial = 1;
	} else if (num < 0) {
		factorial = null; 
	} else if (num % 1 === 0) {
		while (num-=1) {
			factorial *= num;
		}
	}
	return factorial;
};
C.nPr = function(n, r) {
	return C.factorial(n) / C.factorial(n - r);
};
C.nCr = function(n, r) {
	return C.factorial(n) / (C.factorial(n - r) * C.factorial(r));
};

/*** Trigonometry ***/

C.sin = function(angle) {
	return Math.sin(angle * toRad);
};
C.cos = function(angle) {
	return Math.cos(angle * toRad);
};
C.tan = function(angle) {
	return Math.tan(angle * toRad);
};
C.asin = function(num) {
	return Math.asin(num) / toRad;
};
C.acos = function(num) {
	return Math.acos(num) / toRad;
};
C.atan = function(num) {
	return Math.atan(num) / toRad;
};

// Convert to fraction
C.fraction = function(num) {
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
C.radical = function(num) {

	var route, imaginary, i,
		factor, parts = [], ans;

	// If number is imaginary
	if (num < 0) {
		imaginary = true;
	}
	num = abs(num);
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

/*** Factors ***/

// Get factors
C.factors = function(list) {
	if (!list.splice) {list = [list];}
	var max = C.sort(list)[list.length-1],
		factors = [1],
		matching, n, f;
		
	// Loop through all possible factors
	for (f=2; f<=max; f+=1) {
		matching = 0;
		for (n=0; n<list.length; n+=1) {
			// If number is a factor
			if (list[n] % f === 0) {
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
C.gcf = function(list) {
	var factors = C.factors(list);
	return factors[factors.length-1];
};
// Get factors pairs of number
C.pairs = function(num) {
	var factors = C.factors(abs(num)),
		pairs = [], factor, f;
	for (f=0; f<factors.length; f+=1) {
		factor = factors[f];
		pairs.push([factor, num/factor]);
		pairs.push([-factor, -num/factor]);
	}
	return pairs;
};
// Get least common multiple
C.lcm = function(list) {
	list = C.sort(list);
	var prod = C.product(list),
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

/*** Conversions ***/

// Convert number to comma-separated string
C.addCommas = function(num) {
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
C.number = function(num) {
	var parts = String(num).split('/');
	num = String(parts[0] / (parts[1] || 1));
	return parseFloat(num.replace(/,/gi, ''));
};

/*** Conditions ***/

C.isEven = function(num) {
	return (num % 2 === 0);
};
C.isOdd = function(num) {
	return (num % 2 === 1);
};
C.isInteger = function(num) {
	return (num % 1 === 0);
};
C.isPrime = function(num) {
	var factors = C.factors(num);
	return (factors[1] === num);
};
C.isFactor = function(factor, num) {
	return (num % factor === 0);
};

makeChainable();
// Detect degrees/radians change
convertAngles();
watch(C, 'inDegrees', convertAngles);

window.Calc = window.C = C;
}(window, Math, Object, parseFloat, Object, Array, String));