/**@license Calc
Caleb Evans
Licensed under the MIT license
**/
(function(self, Math, parseFloat, parseInt, isNaN, String, Object, Array, TRUE, FALSE, NULL, UNDEFINED) {

// Calc object
var Calc = {};
self.Calc = Calc;

// Set variables (used as aliases)
var _Calc = self.Calc,
	abs = Math.abs,
	round = Math.round,
	floor = Math.floor,
	ceil = Math.ceil,
	pow = Math.pow,
	sqrt = Math.sqrt,
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
Calc.PHI = (1 + sqrt(5)) / 2;
Calc.G = 6.67e-11;

Calc.inDegrees = FALSE;

// Prevent naming conflicts
Calc.noConflict = function() {
	if (self.Calc === Calc) {
		self.Calc = _Calc;
	}
	return Calc;
};

// Prefer degrees instead of radians if chosen
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

/* Number module */

Calc.abs = abs;
Calc.ceil = ceil;
Calc.floor = floor;
Calc.round = Calc.rounded = function(num, places) {
	return places ? parseFloat(num.toFixed(places)) : round(num);
};

// Round to nearest multiple of n
Calc.nearest = function(num, n) {
	return (n === 0) ? 0 : round(num / n) * n;
};

// Chop off decimal (different than floor)
Calc.chop = Calc.chopped = function(num) {
	return num >= 0 ? floor(num) : ceil(num);
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

/* Statistics module */

Calc.sort = Calc.sorted = function(arr, fn) {
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
// Generate a list of numbers through a certain range
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
Calc.summation = function(a, b, fn) {
	var sum = 0, i;
	if (fn !== UNDEFINED) {
		// If function is defined, get sum of series
		for (i=a; i<=b; i+=1) {
			sum += fn(i);
		}
	} else {
		// Otherwise, add up numbers from a through b
		sum = (b - a) * (a + b) / 2
	}
	return sum;
};
Calc.prod = Calc.product = function(arr) {
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
	// If list has no true median
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
	return sqrt(Calc.variance(arr, pop));
};

/* Geometry module */

Calc.slope = function(pt1, pt2) {
	var slope = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
	if (slope === Infinity) {slope = NULL;}
	return slope;
};
Calc.dist = Calc.distance = function(pt1, pt2) {
	pt1 = pt1.slice(0);
	pt2 = pt2.slice(0);
	// Define z-value if omitted
	pt1[2] = pt1[2] || 0;
	pt2[2] = pt2[2] || 0;
	
	return sqrt( pow(pt2[0] - pt1[0], 2) + pow(pt2[1] - pt1[1], 2) + pow(pt2[2] - pt1[2], 2));
};
Calc.midpt = Calc.midpoint = function(pt1, pt2) {
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
	return sqrt(pow(a, 2) + pow(b, 2));
};

/* Array module */

// Filter an array of items using a function
Calc.filter = Calc.filtered = function(arr, fn) {
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

// Create a new array derived from another (determined by a function)
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
		return (Calc.index(arr, v) === k);
	});
};

// Reverse the order of a list or string
Calc.reverse = Calc.reversed = function(arr) {
	// Convert string to array
	if (arr.split) {
		arr = arr.split('');
	}
	arr = arr.slice(0).reverse();
	if (arr.join) {
		arr = arr.join('');
	}
	return arr;
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
	if (n < r) {return 0;}
	return Calc.factorial(n) / Calc.factorial(n - r);
};
Calc.nCr = function(n, r) {
	if (n < r) {return 0;}
	return Calc.factorial(n) / (Calc.factorial(n - r) * Calc.factorial(r));
};

Calc.permute = Calc.permut = function(arr, n) {
	var iArr, perms, perm;

	// Array of calculated permutations
	perms = [];

	// If n is not given, permute entire array
	if (n === UNDEFINED) {
		n = arr.length;
	}

	// If input is string, convert it to array
	if (arr.split) {
		arr = arr.split('');
	}

	// Create array of indices from input array
	iArr = Calc.map(arr, function(v, k) {
		return k;
	});

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
			
			// Construct list of items that are not currently used
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

// Convert radians to degrees d 
Calc.degrees = function(angle) {
	return angle * (180 / Math.PI);
};

// Convert degrees to radians
Calc.radians = function(angle) {
	return angle * (Math.PI / 180);
};

// Convert angle to radian notation
Calc.radiansf = function(angle) {
	angle *= toDeg;
	// Convert to degrees
	var frac = Calc.fractionf(angle / 180);
	
	// Format fraction in terms of pi
	frac = frac
		// Multiply by pi
		.replace(/^(-)?1$/gi, '$1π')
		.replace(/\//gi, 'π/')
		// 1*pi is just pi
		.replace(/^(-)?1π/gi, '$1π')
		// x/1 is just x
		.replace(/\/1$/gi, '');
	
	return frac;
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
Calc.atan2 = function(a, b) {
	return Math.atan2(a, b) / toRad;
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
	return log(num + sqrt((num*num + 1))) / toRad;
};
Calc.acosh = function(num) {
	return log(num + sqrt((num*num - 1))) / toRad;
};
Calc.atanh = function(num) {
	return log((1 + num) / (1 - num)) / 2 / toRad;
};

/* Coordinate module */

// Find coterminal angle between 0 and 360 degrees
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

// Convert rectangular coordinates to polar coordinates
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
	var common, min,
		factors = [1],
		f, i;
	
	// Keep only positive numbers
	for (i=0; i<arr.length; i+=1) {
		if (arr[i]) {
			arr[i] = abs(arr[i]);
		} else {
			// Eliminate zeroes
			arr.splice(i, 1);
			i -= 1;
		}
	}
	
	if (arr.length) {
	
		min = Calc.min(arr);
			
		// Loop through all possible factors
		for (f=2; f<=min; f+=1) {
			common = TRUE
			for (i=0; i<arr.length; i+=1) {
				// If number does not divide evenly, it is not a factor
				if (arr[i] % f !== 0) {
					common = FALSE
				}
			}
			// If number is a common factor
			if (common) {
				factors.push(f);
			}
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
	var prod, lcm, common, m, i;
	prod = Calc.product(arr);
	
	// Loop throughn possible multiples
	for (m=1; m<=prod; m+=1) {
		common = TRUE;
		for (i=0; i<arr.length; i+=1) {
			// If number is multiple
			if (m % arr[i] !== 0) {
				common = FALSE;
			}
		}
		// If multiple is a multiple of all given numbers
		if (common) {
			lcm = m;
			break;
		}
	}
	return lcm;
};

// Get Fibonacci numbers through index n
Calc.fib = function(n) {
	return round( pow(Calc.PHI, n) / sqrt(5) );
};

/* Representation module */

// Convert to fraction
Calc.frac = Calc.fraction = function(num) {
	var dec = 1,
		top = 1,
		bot = 1,
		i = 0,
		sign;
	
	num = Calc.correct(num);
	
	// Only deal with positive numbers
	sign = Calc.sign(num);
	num = abs(num);
	
	while (dec !== num) {
		if (i < 1e5) {
			if (dec < num) {
				// Make fraction bigger if too small
				top += 1;
			} else {
				// Mae fraction smaller if too big
				bot += 1;
				top = floor(num * bot);
			}
			dec = top / bot;
			i += 1;
		} else {
			return null;
		}
	}
	// If fraction is zero, simplify it
	if (top === 0) {
		top = 0;
		bot = 1;
	}
	// Make number negative again if necessary
	top *= sign;
	
	return [top, bot]
};

// Return a number as a formatted simplified fraction
Calc.fracf = Calc.fractionf = function(num) {
	var frac = Calc.frac(num);
	if (frac === null) {
		frac = String(num);
	} else {
		frac = frac
			.join('/')
	}
	return frac;
};

// Return the square root of a number as a simplified radical
Calc.radical = function(num) {
	var root, ans, f, negative;
	
	// Make number negative later
	if (num < 0) {
		num = abs(num);
		negative = TRUE;
	}
		
	// Calculate square root	
	root = sqrt(num);
	ans = [1, num];

	if (root % 1 === 0) {
		// If number is a perfect square, skip other steps
		ans = [root, 1];
	} else {
		// Loop through possible factors
		for (f=2; f<num; f+=1) {
			factor = num / f;
			// If number is a factor
			if (factor % 1 === 0) {
				root = sqrt(factor);
				// If factor is also a perfect square, use it
				if (root % 1 === 0) {
					ans = [root, num/factor];
					break;
				}
			}
		}
	}
	
	// Make radical imaginary if necessary
	if (negative) {
		ans[1] *= -1;
	}
	
	return ans;
};

// Return the square root of a number as a formatted simplified radical
Calc.radicalf = function(num) {
	return Calc.radical(num)
		.join('√')
		// 1√x is just √x
		.replace(/1√/gi, '√')
		// The square root of a negative number is an imaginary number
		.replace(/√\-/gi, 'i√')
		// x√1 is just x
		.replace(/√1$/gi, '')
};

// Convert number to comma-separated string
Calc.commas = function(num) {
	var parts = String(num).split('.');
	// Do not convert if number is exponential
	if (parts[0].indexOf('e') === -1) {
		parts[0] = parts[0]
			.split('')
			.reverse()
			.join('')
			.replace(/(\d{3})/gi, '$1,')
			.replace(/,(-?)$/gi, '$1')
			.split('')
			.reverse()
			.join('');
	}
	return parts.join('.');
};

// Remove commas from a comma-separated number
Calc.noCommas = function(str) {
	str = str.replace(/,/gi, '')
	return parseFloat(str);
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
	return (factors.length === 2);
};
Calc.isComposite = function(num) {
	num = abs(num);
	return (Calc.factors(num).length > 2);
};
Calc.isFactor = function(factor, num) {
	return (num % factor === 0);
};
// If number is in Fibonacci sequence
Calc.isFib = function(num) {
	var ans, a, b;
	a = 5 * pow(num, 2) + 4;
	// Accept zero as input
	if (num > 0) {
		b = 5 * pow(num, 2) - 4;
	} else {
		b = a
	}
	if (sqrt(a) % 1 === 0 || sqrt(b) % 1 === 0) {
		ans = TRUE;
	} else {
		ans = FALSE;
	}
	return ans;
};

/* Random Module */

// Get random number or arr index
Calc.random = Calc.rand = function(a, b) {
	if (a === UNDEFINED && b === UNDEFINED) {
		a = 0;
		b = 1;
	} else if (b === UNDEFINED) {
		b = a;
		a = 0;
	}
	// Get random index of the given arr
	if (b.length) {
		return floor(b.length * random());
	}
	return a + (b - a) * random();
};

// Get random integer
Calc.randInt = function(a, b) {
	return round(Calc.rand(a, b));
};

// Scramble a arr of numbers
Calc.scramble = Calc.scrambled = function(arr) {
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
Calc.dec = Calc.decimal = function(num, base) {
	return parseInt(num, base);
};
// Binary
Calc.bin = Calc.binary = function(num) {
	return num.toString(2);
};
// Octal
Calc.oct = Calc.octal = function(num) {
	return num.toString(8);
};
// Hexadecimal
Calc.hex = function(num) {
	return num.toString(16);
};

/* Boolean module */

Calc.not = function(bool) {
	return !bool;
};
Calc.and = function(bool1, bool2) {
	return (!!bool1 && !!bool2);
};
Calc.or = function(bool1, bool2) {
	return (!!bool1 || !!bool2);
};
Calc.xor = function(bool1, bool2) {
	return ((!!bool1 || !!bool2) && (bool1 !== bool2));
};
Calc.nand = function(bool1, bool2) {
	return !(!!bool1 && !!bool2);
};
Calc.nor = function(bool1, bool2) {
	return !(!!bool1 || !!bool2);
};

/* Function module */

// Approximate zeroes of function using a function and its derivative
Calc.approx = function(fn, der) {
	var x = [fn(0)], n;
	
	for (n=0; n<100; n+=1) {
		x.push(x[n] - (fn(x[n]) / der(x[n])))
	}
	return x[x.length-1];
};

/* Matrix module */

// Matrix constructor
function Matrix(m1) {
	if (m1 && m1.constructor === Matrix) {
		m1 = m1.matrix.slice(0);
	} else if (m1 === undefined) {
		m1 = [[1]];
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
function _crossout(m1, pt) {
	var r, c;
	m1 = m1.slice(0);
	m1.splice(pt[0], 1);
	for (r=0; r<m1.length; r+=1) {
		m1[r] = m1[r].slice(0);
		for (c=0; c<m1[r].length; c+=1) {
			if (c === pt[1]) {
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
matrix.value = function(index) {
	var m1 = this.matrix,
		ncols = _ncols(m1),
		row = ceil(index / ncols) - 1,
		col = index % ncols;
	return m1[row][col];
}
matrix.nvalues = function() {
	var m1 = this.matrix;
	return _nrows(m1) * _ncols(m1);
};

// Add matrices
matrix.add = function(m2) {
	var m1 = this.matrix,
		r, c, ans = [];
	m2 = Calc.matrix(m2).matrix;
	// Only matrices of the same dimensions can be added
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
		nrows = m1.length,
		ncols = m2[0].length,
		ans = [];
	// If matrices cannot be multiplied
	if (m1[0].length !== m2.length) {
		return NULL;
	}
	// Loop through resultant rows
	for (r=0; r<nrows; r+=1) {
		ans[r] = [];
		// Loop through resultant's columns
		for (c=0; c<ncols; c+=1) {
			n = 0;
			// Match up row from matrix 1 with column from matrix 2
			row = _row(m1, r);
			col = _col(m2, c);
			for (rr=0; rr<row.length; rr+=1) {
				n += (row[rr] * col[rr]);
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
matrix.transpose = matrix.reflect = function() {
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

// Calculate adjugate matrix
matrix.adjugate = matrix.adj = function() {
	return this.cofactors().transpose();
};

// Calculate inverse
matrix.inverse = matrix.inv = function() {
	var inst = this,
		m1 = inst.matrix,
		nrows = _nrows(m1),
		ncols = _ncols(m1),
		det = inst.det(),
		inv;
	if (nrows === 1 && ncols === 1) {
		inv = [[ 1 / m1[0][0] ]];
	} else if (nrows > 1 && ncols > 1) {
		inv = (det ? inst.adjugate().scale(1/det) : NULL);
	}
	return Calc.matrix(inv);
};

// Construct identity matrix from input matrix
matrix.identity = matrix.iden = function() {
	var inst = this,
		m1 = inst.matrix,
		ncols = _ncols(m1),
		iden = [],
		r, c,
		d = 0,
		value;
		
	for (r=0; r<ncols; r+=1) {
		iden[r] = [];
		for (c=0; c<ncols; c+=1) {
			if (c == d) {
				// If cell is on the diagonal, give it a value of one
				value = 1;
			} else {
				// Otherwise, give it a value of 0
				value = 0;
			}
			iden[r][c] = value;
		}
		d += 1;
	}
	return Calc.matrix(iden);
}

/* Vector module */

// Vector constructor
function Vector(v1) {
	if (v1 && v1.constructor === Vector) {
		v1 = v1.vector;
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
	return sqrt(pow(v1[0], 2) + pow(v1[1], 2) + pow(v1[2], 2));
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

}(self, Math, parseFloat, parseInt, isNaN, String, Object, Array, true, false, null));