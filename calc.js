/**@license Calc v1.2b
Caleb Evans
Licensed under the MIT license
**/
(function(self, Math, parseFloat, parseInt, isNaN, String, Object, Array, TRUE, FALSE, NULL, UNDEFINED) {

// Calc function
function Calc(input) {
	var obj = this;
	// Eliminate need to call "new"
	if (obj === self) {
		return new Calc(input);
	// If input is already wrapped
	} else if (input.constructor === Calc) {
		return input;
	}
	obj.value = input;
	obj.original = input;
	return obj;
}
self.Calc = Calc;

// Set variables (used as aliases)
var _Calc = self.Calc,
	abs = Math.abs,
	round = Math.round,
	floor = Math.floor,
	ceil = Math.ceil,
	pow = Math.pow,
	exp = Math.exp,
	log = Math.log,
	random = Math.random,
	toRad = 1,
	toDeg = 180 / Math.PI,
	radic = '\u221a',
	matrix, vector;
	
// Calc constants
Calc.PI = Math.PI;
Calc.E = Math.E;
Calc.PHI = (1 + pow(5, 0.5)) / 2;
Calc.G = 6.67e-11;

Calc.fn = Calc.prototype;
Calc.inDegrees = FALSE;
Calc.version = '1.2b';

// Convert regular methods for the Calc function
function constructFn(name) {
	var fn = Calc[name];
	if (fn.call && !Calc.fn[name]) {
		// Map "this" with method's first argument
		Calc.fn[name] = function() {
			var inst = this,
				args = ([]).slice.call(arguments, 0);
			inst.value = fn.apply(inst, [inst.value].concat(args));
			return inst;
		};
	}
}

// Make all methods chainable
function makeChainable(name) {
	var p;
	if (name !== UNDEFINED) {
		// Apply to only a single method
		return constructFn(name);
	} else {
		// Apply to all methods
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
	if (self.Calc === Calc) {
		self.Calc = _Calc;
	}
	return Calc;
};

// Convert degrees to radians
Calc.useDegrees = function(value) {
	if (value || value === UNDEFINED) {
		toRad = Math.PI / 180;
		toDeg = 1;
		Calc.inDegrees = TRUE;
	} else {
		toRad = 1;
		toDeg = 180 / Math.PI;
		Calc.inDegrees = FALSE;
	}
	return Calc;
};

// useDegrees() method for chaining
Calc.fn.useDegrees = function(value) {
	Calc.useDegrees(value);
	return this;
};

/* Number module */

Calc.abs = abs;
Calc.ceil = ceil;
Calc.floor = floor;
Calc.rounded = Calc.round = function(num, places) {
	return places ? parseFloat(num.toFixed(places)) : round(num);
};

// Round to nearest n
Calc.nearest = function(num, n) {
	n = n || 1;
	return round(num / n) * n;
};

// Chop off decimal (different than floor)
Calc.chopped = Calc.chop = function(num) {
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

/* Exponent module */

Calc.pow = function(base, exp) {
	if (exp === UNDEFINED) {exp = 2;}
	return pow(base, exp);
};
Calc.root = function(base, root) {
	if (root === UNDEFINED) {root = 2;}
	return pow(base, 1/root);
};
Calc.log = function(num, base) {
	if (base === UNDEFINED) {base = 10;}
	return log(num) / log(base);
};
Calc.ln = log;
Calc.exp = exp;

// Solve quadratic equation
Calc.quadratic = function(a, b, c) {
	var discr = pow(b, 2) - (4*a*c),
		ans = NULL;
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
		ans = NULL;
	}
	return ans;
};

/* Statistic module */

Calc.sorted = Calc.sort = function(arr, fn) {
	arr = arr.slice(0);
	if (fn && fn.call) {
		arr.sort(function(a, b) {
			return fn(a) - fn(b);
		});
	} else {
		arr.sort(function(a, b) {
			return a - b;
		});
	}
	return arr;
};
Calc.min = function(arr) {
	return Math.min.apply(Math, arr);
};
Calc.max = function(arr) {
	return Math.max.apply(Math, arr);
};
Calc.range = function(arr) {
	return Calc.max(arr) - Calc.min(arr);
};
// Generate a arr of numbers through a certain range
Calc.thru = function(start, end, step) {
	var arr = [], i;
	// If no starting number is specified
	if (end === UNDEFINED) {
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
Calc.sum = function(arr) {
	var sum = 0, i;
	for (i=0; i<arr.length; i+=1) {
		sum += arr[i];
	}
	return sum;
};
Calc.product = function(arr) {
	var prod = 1, i;
	for (i=0; i<arr.length; i+=1) {
		prod *= arr[i];
	}
	return prod;
};
Calc.mean = function(arr) {
	return Calc.sum(arr) / arr.length;
};
Calc.geoMean = function(arr) {
	return pow(Calc.product(arr), 1/arr.length);
};
Calc.median = function(arr) {
	var med, m1, m2;
	arr = Calc.sort(arr);
	// If arr has no true median
	if (arr.length % 2 === 0) {
		m1 = arr[arr.length/2 - 1];
		m2 = arr[arr.length/2];
		med = Calc.mean([m1, m2]);
	// But if it does...
	} else {
		med = arr[floor(arr.length/2)];
	}
	return med;
};
Calc.modes = function(arr) {
	var map = [],
		modes = [],
		maxCount = 1,
		item, i;
	for (i=0; i<arr.length; i+=1) {
		item = arr[i];
		if (map[item] === UNDEFINED) {
			map[item] = 1;
		} else {
			map[item] += 1;
		}
		if (map[item] > maxCount) {
			modes = [item];
			maxCount = map[item];
		} else if (map[item] === maxCount) {
			modes.unshift(item);
			maxCount = map[item];
		}
	}
	// There are no modes if no repeating arr items are found
	if (modes.length === arr.length) {
		modes = [];
	}
	return modes;
};
Calc.variance = function(arr, pop) {
	var n = arr.length,
		mean = Calc.mean(arr),
		top = 0,
		inside, i;
	for (i=0; i<arr.length; i+=1) {
		top += pow(arr[i]-mean, 2);
	}
	// If population is chosen
	if (pop) {
		inside = top / n;
	} else {
		inside = top / (n - 1);
	}
	return inside;
};
Calc.stdDev = function(arr, pop) {
	return pow(Calc.variance(arr, pop), 0.5);
};

/* Geometry module */

Calc.slope = function(pt1, pt2) {
	var slope = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
	if (slope === Infinity) {slope = NULL;}
	return slope;
};
Calc.distance = Calc.dist = function(pt1, pt2) {
	pt1 = pt1.slice(0);
	pt2 = pt2.slice(0);
	// Define z-value if omitted
	pt1[2] = pt1[2] || 0;
	pt2[2] = pt2[2] || 0;
	
	return pow(
		pow(pt2[0] - pt1[0], 2) + pow(pt2[1] - pt1[1], 2) + pow(pt2[2] - pt1[2], 2),
	0.5);
};
Calc.midpoint = Calc.midpt = function(pt1, pt2) {
	pt1 = pt1.slice(0);
	pt2 = pt2.slice(0);
	// Define z-value if omitted
	pt1[2] = pt1[2] || 0;
	pt2[2] = pt2[2] || 0;
	
	return [
		(pt1[0] + pt2[0]) / 2,
		(pt1[1] + pt2[1]) / 2,
		(pt1[2] + pt2[2]) / 2
	];
};
Calc.hypot = function(a, b) {
	return pow(pow(a, 2) + pow(b, 2), 0.5);
};

/* Array module */

// Filter an array of items using a function
Calc.filtered = Calc.filter = function(arr, fn) {
	var filtered, i;
	if (arr.filter) {
		filtered = arr.filter(fn);
	} else {
		filtered = [];
		for (i=0; i<arr.length; i+=1) {
			if (fn.call(arr, arr[i], i, arr)) {
				filtered.push(arr[i]);
			}
		}
	}
	return filtered;
};

// Filter an array of items using a function
Calc.map = function(arr, fn) {
	var mapped, i;
	if (arr.map) {
		mapped = arr.map(fn);
	} else {
		mapped = [];
		for (i=0; i<arr.length; i+=1) {
			mapped.push(fn.call(arr, arr[i], i, arr));
		}
	}
	return mapped;
};

// Get the index of an item in an array
Calc.index = function(arr, item) {
	var index, i;
	if (arr.indexOf) {
		index = arr.indexOf(item);
	} else {
		index = -1;
		for (i=0; i<arr.length; i+=1) {
			if (arr[i] === item) {
				index = i;
				break;
			}
		}
	}
	return index;
};

// Remove duplicates from the given array
Calc.unique = function(arr) {
	return Calc.filtered(arr, function(v, k) {
		return (Calc.index(arr, v) === k)
	});
};

/* Combinatorics module */

Calc.factorial = function(num) {
	var factorial = num, i;
	if (num === 0) {
		factorial = 1;
	} else if (num < 0) {
		factorial = NULL;
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

Calc.loop = function(nLoops, nIterations, callback) {
	
	// Keep track of the iterations for each and every loop
	var iterations = [];
	
	// Providing the number of iterations is optional
	if (nIterations.call) {
		callback = nIterations;
		nIterations = nLoops;
	}
	
	// Recursive function
	function loop(iteration) {
		
		// Keep track of current iteration for each loop
		for (var i=0; i<nIterations; i+=1) {
			
			// Ensure saved iteration is always up-to-date
			iterations[iteration] = i;
			
			// Ensure recursion only lasts until end
			if ((iteration + 1) < nLoops) {
				loop(iteration + 1);
			} else {
				// Run callback function in deepest loop
				callback(iterations.slice(0));
			}
			
		}
	}
	// Only loop if number of loops is at least one
	if (nLoops) {
		loop(0);
	}
	return Calc;
};

Calc.permut = Calc.permute = function(arr, n) {
	var iArr, perms, perm, iPerm;

	// Array of calculated permutations
	perms = [];
	// Create array of indices from input array
	iArr = Calc.map(arr, function(v, k) {
		return k;
	});	

	// If n is not given, permute entire array
	if (n === UNDEFINED) {
		n = arr.length;
	}

	// If input is string, convert it to array
	if (arr.split) {
		arr = arr.split('');
	}

	// Internal permute function
	function _permute(iPerm) {
		var i;

		// If permutation reaches the given length, use it
		if (iPerm.length === n) {
			
			// Convert array of indices to array of items
			perm = Calc.map(iPerm, function(v, k) {
				return arr[v];
			});
			
			// Add permutation to list of permutations
			perms.push(perm);
			
		} else {
			
			// Otherwise, compute permutations by rearranging the input array
			var items = Calc.filtered(iArr, function(v, k) {
				return (Calc.index(iPerm, v) === -1);
			});
			
			for(i=0; i<items.length; i+=1) {
				_permute( iPerm.concat(items[i]) );
			}
		}
    
    }
    _permute([]);
    return perms;
};

/* Trigonometry module */

// Convert angle to radian notation
Calc.radians = function(angle) {
	angle = angle || 0;
	angle *= toDeg;
	// Convert to degrees
	var parts = Calc.frac(abs(angle) / 180).split('/');
	
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

/* Coordinate module */

// Find coterminal angle between 0 and 360
Calc.coterminal = function(angle) {
	angle *= toDeg;
	return (angle - (360 * Calc.floor(angle/360)) ) / toDeg;
};

// Convert polar coordinates to rectangular
Calc.rect = function(pt) {
	var x, y;
	x = pt[0] * Calc.cos(pt[1]);
	y = pt[0] * Calc.sin(pt[1]);
	return [x, y];
};

// Convert rectangular coordinates to polar
Calc.polar = function(pt) {
	var r = Calc.hypot(pt[0], pt[1]),
		t = Calc.atan2(pt[1], pt[0]);
	// Find positive coterminal of angle
	if (t < 0) {
		t = Calc.coterminal(t);
	}
	return [r, t];
};

// Find quadrant fron a given angle or point
Calc.quadrant = function(angle) {
	var quadrant, remainder;
	// If input is a set of points
	if (angle.push) {
		angle = Calc.polar(angle)[1];
	}
	// Convert angle to radians
	angle *= toRad;
	remainder = angle - Math.PI*2 * Calc.floor(angle/(Math.PI*2));
	quadrant = angle ? (Calc.ceil(remainder / (Math.PI/2)) || 1) : 1;
	return quadrant;
};

/* Factor module */

// Get factors
Calc.factors = function(arr) {
	// Create and clone arr
	if (!arr || !arr.push) {
		arr = [arr];
	} else {
		arr = arr.slice(0);
	}
	var matching, min,
		factors = [1],
		f, i;
	
	// Deal with positive numbers only
	for (i=0; i<arr.length; i+=1) {
		if (arr[i]) {
			arr[i] = abs(arr[i]);
		} else {
			// Eliminate zeroes
			arr.splice(i, 1);
			i -= 1;
		}
	}
	min = Calc.min(arr);
		
	// Loop through all possible factors
	for (f=2; f<=min; f+=1) {
		matching = 0;
		for (i=0; i<arr.length; i+=1) {
			// If number is a factor
			if (arr[i] % f === 0) {
				matching += 1;
			}
		}
		// If number is a common factor
		if (matching === arr.length) {
			factors.push(f);
		}
	}
	return factors;
};
// Get greatest common factor
Calc.gcf = function(arr) {
	var factors = Calc.factors(arr);
	return factors[factors.length-1];
};

// Get least common multiple
Calc.lcm = function(arr) {
	var prod, lcm, matching, m, i;
	prod = Calc.product(arr);
	
	// Loop throughn possible multiples
	for (m=1; m<=prod; m+=1) {
		matching = 0;
		for (i=0; i<arr.length; i+=1) {
			// If number is multiple
			if (m % arr[i] === 0) {
				matching += 1;
			}
		}
		// If multiple is a multiple of all given numbers
		if (matching === arr.length) {
			lcm = m;
			break;
		}
	}
	return lcm;
};

// Get Fibonacci numbers through index n
Calc.fib = function(n) {
	var seq = [0, 1], i;
	if (!n) {return 0;}
	// Loop through sequence
	for (i=0; i<n-1; i+=1) {
		seq = [seq[1], seq[0]+seq[1]];
	}
	return seq[1];
};

/* Representation module */

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
		negative = TRUE;
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
		imaginary = TRUE;
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

/* Condition module */

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
		last, total, ans = FALSE, i;
	if (num === 0 || num === 1) {
		ans = TRUE;
	} else {
		// Loop through sequence
		for (i=0; i<num-1; i+=1) {
			last = seq[1];
			total = seq[0] + last;
			seq = [last, total];
			if (seq[1] === num) {
				ans = TRUE;
				break;
			}
		}
	}
	return ans;
};

/* Random Module */

// Get random number or arr index
Calc.rand = Calc.random = function(a, b) {
	if (a === UNDEFINED && b === UNDEFINED) {
		a = 0;
		b = 1;
	} else if (a === UNDEFINED) {
		a = 0;
	}
	// Get random index of the given arr
	if (a.push) {
		return floor(a.length * random());
	} else if (b === UNDEFINED) {
		b = a;
		a = 0;
	}
	return a + (b - a) * random();
};

// Get random integer
Calc.randInt = function(a, b) {
	return round(Calc.rand(a, b));
};

// Scramble a arr of numbers
Calc.scrambled = Calc.scramble = function(arr) {
	var item, i;
	arr = arr.slice(0);
	for (i=0; i<arr.length; i+=1) {
		item = arr[i];
		arr.splice(i, 1);
		arr.splice(Calc.random(arr), 0, item);
	}
	return arr;
};
// Get a random selection from a arr
Calc.choices = function(arr, n) {
	return Calc.scramble(arr).slice(0, n || 1);
};
// Get a random number from a arr
Calc.choice = function(arr, n) {
	return Calc.scramble(arr)[0];
};

/* Base module */

// Any base
Calc.base = function(num, base) {
	return num.toString(base);
};
// Decimal
Calc.dec = function(num, base) {
	return parseInt(num, base);
};
// Binary
Calc.bin = function(num) {
	return num.toString(2);
};
// Octal
Calc.oct = function(num) {
	return num.toString(8);
};
// Hexadecimal
Calc.hex = function(num) {
	return num.toString(16);
};

/* Matrix module */

// Matrix constructor
function Matrix(m1) {
	m1 = m1 || [];
	var type = m1.constructor;
	if (type === Matrix) {
		return m1;
	} else if (type === Vector) {
		m1 = [m1.vector];
	}
	this.matrix = m1;
}
Calc.matrix = function(m1) {
	return new Matrix(m1);
};
matrix = Matrix.prototype;

// Get row/column from index
function _row(m1, r) {
	return m1[r];
}
function _col(m1, c) {
	var arr = [], r;
	for (r=0; r<m1.length; r+=1) {
		arr.push(m1[r][c]);
	}
	return arr;
}
// Get number of rows/columns
function _nrows(m1) {
	return m1.length;
}
function _ncols(m1) {
	if (m1.length === 0) {return 0;}
	return m1[0].length;
}

// Cross out row/column in matrix (internal)
function _crossout(m1, p) {
	var r, c;
	m1 = m1.slice(0);
	m1.splice(p[0], 1);
	for (r=0; r<m1.length; r+=1) {
		m1[r] = m1[r].slice(0);
		for (c=0; c<m1[r].length; c+=1) {
			if (c === p[1]) {
				m1[r].splice(c, 1);
			}
		}
	}
	return m1;
}

// Find determinant (internal)
function _det(m1) {
	var sign = 1,
		top = m1[0],
		ncols = _ncols(m1),
		sub,
		ans = 0, c;
		for (c=0; c<ncols; c+=1) {
			sub = _crossout(m1.slice(0), [0, c]);
			// Calculate determinant and add onto answer
			ans += (top[c] * sign) * Calc.matrix(sub).det();
			sign *= -1;
		}
	return ans;
}

// Scale matrix
matrix.scale = function(scalar) {
	var m1 = this.matrix.slice(0),
		r, c;
	for (r=0; r<m1.length; r+=1) {
		for (c=0; c<m1[r].length; c+=1) {
			m1[r][c] *= scalar;
		}
	}
	return Calc.matrix(m1);
};

// Matrix traversal
matrix.row = function(r) {
	return _row(this.matrix, r);
};
matrix.col = function(c) {
	return _col(this.matrix, c);
};
matrix.nrows = function() {
	return _nrows(this.matrix);
};
matrix.ncols = function() {
	return _ncols(this.matrix);
};

// Add matrices
matrix.add = function(m2) {
	var m1 = this.matrix,
		r, c, ans = [];
	m2 = Calc.matrix(m2).matrix;
	if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
		return NULL;
	}
	for (r=0; r<m1.length; r+=1) {
		ans[r] = [];
		for (c=0; c<m1[r].length; c+=1) {
			ans[r][c] = (m1[r][c] + m2[r][c]);
		}
	}
	return Calc.matrix(ans);
};

// Subtract matrices
matrix.subtract = function(m2) {
	return this.add(Calc.matrix(m2).scale(-1));
};

// Multiply matrices
matrix.multiply = function(m2) {
	m2 = Calc.matrix(m2).matrix;
	var m1 = this.matrix,
		r, c, rr, n,
		row, col,
		rows = m1.length,
		cols = m2[0].length,
		ans = [];
	// If matrices cannot be multiplied
	if (m1[0].length !== m2.length) {
		return NULL;
	}
	// Loop through resultant rows
	for (r=0; r<rows; r+=1) {
		ans[r] = [];
		// Loop through resultant's columns
		for (c=0; c<cols; c+=1) {
			n = 0;
			// Match up row from matrix 1 and column from matrix 2
			row = _row(m1, r);
			col = _col(m2, c);
			for (rr=0; rr<row.length; rr+=1) {
				n += (row[rr] * col[rr]);
				if (isNaN(n)) {return NULL;}
			}
			ans[r][c] = n;
		}
	}
	return Calc.matrix(ans);
};

// Calculate determinant of a matrix
matrix.det = function() {
	var m1 = this.matrix,
		nrows = _nrows(m1),
		ncols = _ncols(m1);
	if (nrows === 1 && ncols === 1) {
		return m1[0][0];
	} else if (nrows > 1 && ncols > 1) {
		return _det(m1);
	} else {
		return NULL;
	}
};

// Transpose (reflect) matrix
matrix.transpose = function() {
	var m1 = this.matrix,
		nrows = _nrows(m1),
		ncols = _ncols(m1),
		reflected = [], r, c;
	for (c=0; c<ncols; c+=1) {
		reflected[c] = [];
		for (r=0; r<nrows; r+=1) {
			reflected[c][r] = m1[r][c];
		}
	}
	return Calc.matrix(reflected);
};

// Get cofactors of a matrix
matrix.cofactors = function() {
	var m1 = this.matrix,
		nrows = _nrows(m1),
		ncols = _ncols(m1),
		factors = [],
		rsign = 1, csign,
		sub, r, c;
	m1 = m1.slice(0);

	for (r=0; r<nrows; r+=1) {
		csign = rsign;
		factors[r] = [];
		for (c=0; c<ncols; c+=1) {
			sub = _crossout(m1, [r, c]);
			factors[r].push(Calc.matrix(sub).det() * csign);
			csign *= -1;
		}
		rsign *= -1;
	}
	return Calc.matrix(factors);
};

// Calculate adjoint matrix
matrix.adj = function() {
	return this.cofactors().transpose();
};

// Calculate inverse
matrix.inv = function() {
	var inst = this,
		m1 = inst.matrix,
		nrows = _nrows(m1),
		ncols = _ncols(m1),
		det = inst.det(),
		inv;
	if (nrows === 1 && ncols === 1) {
		inv = [[ 1 / m1[0][0] ]];
	} else if (nrows > 1 && ncols > 1) {
		inv = (det ? inst.adj().scale(1/det) : NULL);
	}
	return Calc.matrix(inv);
};

/* Vector module */

// Vector constructor
function Vector(v1) {
	if (v1 && v1.constructor === Vector) {
		return v1;
	}
	v1 = v1 || [0, 0, 0];
	v1 = v1.slice(0);
	// If z-position is not given
	v1[2] = v1[2] || 0;
	this.vector = v1;
}
Calc.vector = function(v1) {
	return new Vector(v1);
};
vector = Vector.prototype;

// Magnitude of vector
vector.mag = function() {
	var v1 = this.vector;
	return pow(pow(v1[0], 2) + pow(v1[1], 2) + pow(v1[2], 2), 0.5);
};
// Angle (direction) of vector
vector.angle = function() {
	return Calc.polar(this.vector)[1];
};
// Scale a vector
vector.scale = function(scalar) {
	var v1 = this.vector.slice(0);
	v1[0] *= scalar;
	v1[1] *= scalar;
	v1[2] *= scalar;
	return Calc.vector(v1);
};
// Sum of two vectors
vector.add = function(v2) {
	var v1 = this.vector;
	v2 = Calc.vector(v2).vector;
	return Calc.vector([
		v1[0] + v2[0],
		v1[1] + v2[1],
		v1[2] + v2[2]
	]);
};
// Difference of two vectors
vector.subtract = function(v2) {
	return this.add(Calc.vector(v2).scale(-1));
};
// Dot product of two vectors
vector.dot = function(v2) {
	var v1 = this.vector;
	v2 = Calc.vector(v2).vector;
	return (v1[0] * v2[0]) + (v1[1] * v2[1]);
};
// Cross product of two 3D vectors
vector.cross = function(v2) {
	var v1 = this.vector;
	v2 = Calc.vector(v2).vector;
	if (v1[2] === 0 || v2[2] === 0) {
		return NULL;
	}
	return Calc.vector([
		(v1[1] * v2[2]) - (v1[2] * v2[1]),
		(v1[2] * v2[0]) - (v1[0] * v2[2]),
		(v1[0] * v2[1]) - (v1[1] * v2[0])
	]);
};

// Make all methods chainable
makeChainable();

return Calc;
}(self, Math, parseFloat, parseInt, isNaN, String, Object, Array, true, false, null));