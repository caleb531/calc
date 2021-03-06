/**
 * @license Calc
 * Copyright 2013, Caleb Evans
 * Licensed under the MIT license
 */
(function(self, Math, parseFloat, parseInt, String, TRUE, FALSE, NULL, UNDEFINED) {

var
	// Calc object
	Calc = {},

	// Map over the current global Calc in case of overwrite
	_Calc = self.Calc,

	// Aliases to Math methods
	abs = Math.abs,
	round = Math.round,
	floor = Math.floor,
	ceil = Math.ceil,
	pow = Math.pow,
	sqrt = Math.sqrt,
	exp = Math.exp,
	log = Math.log,
	random = Math.random,
	PI = Math.PI,
	E = Math.E,

	// Object types created by Calc
	matrix, vector;

// Export Calc to window
self.Calc = Calc;

// Calc constants
Calc.PI = PI;
Calc.E = E;
Calc.PHI = (1 + sqrt(5)) / 2;
Calc.G = 6.673848e-11;

// Prevent naming conflicts. Restores the previous "Calc"
// global variable (possibly owned by another program)
Calc.noConflict = function() {
	if (self.Calc === Calc) {
		self.Calc = _Calc;
	}
	return Calc;
};


/* Number module */

Calc.abs = abs;
Calc.ceil = ceil;
Calc.floor = floor;
Calc.rounded = Calc.round = function(num, places) {
	return (places ? parseFloat(num.toFixed(places)) : round(num));
};

// Round to nearest multiple of n
Calc.nearest = function(num, n) {
	return (n === 0) ? 0 : round(num / n) * n;
};

// Correct implementation of the modulo operator
Calc.mod = function(num, n) {
	return ((num % n) + n) % n;
};

// Chop off decimal (different than floor)
Calc.chopped = Calc.chop = function(num) {
	return (num >= 0 ? floor(num) : ceil(num));
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

// Correct a number's binary rounding error
Calc.correct = function(num) {
	if (String(num).indexOf('e') === -1 && Calc.round(num, 14) === Calc.round(num, 13)) {
		return Calc.round(num, 14);
	} else {
		return num;
	}
};

/* Exponent module */

// Raise number to a power
Calc.pow = pow;

// Get the nth root of a number
// TODO: Correct rounding error?
Calc.root = function(base, root) {
	return pow(base, 1 / root);
};

// Alias to Math.sqrt() for convenience
Calc.sqrt = sqrt;

// Take the base-n logarithm of a number
Calc.log = function(num, base) {
	// Base defaults to 10
	if (base === UNDEFINED) {
		base = 10;
	}
	return log(num) / log(base);
};

// Take the natural logarithm of a number
Calc.ln = log;

// Raise the constant e to a power
Calc.exp = exp;


/* Statistics module */

// Find the smallest value in an array
Calc.min = function(arr) {
	return Math.min.apply(Math, arr);
};

// Find the largest value in an array
Calc.max = function(arr) {
	return Math.max.apply(Math, arr);
};

// Get the range of an array of numbers (highest - lowest)
Calc.range = function(arr) {
	return Calc.max(arr) - Calc.min(arr);
};

// Generate an array of numbers through a certain range
// This method is equivalent to the range() function in other languages
Calc.thru = function(start, end, step) {
	var arr = [], i;

	// If no starting number is specified
	if (end === UNDEFINED) {
		end = start;
		start = 0;
	}

	// If step is 0 or undefined
	if (!step) {step = 1;}

	// Prevent infinite loop if the start number is greater than the end number
	if (step === -1) {
		for (i = start; i >= end; i += step) {
			arr.push(i);
		}
	} else {
		for (i = start; i <= end; i += step) {
			arr.push(i);
		}
	}

	return arr;
};

// Calculate the sum of all numbers in an array
Calc.sum = function(arr) {
	var sum = 0, i, len;
	for (i = 0, len = arr.length; i < len; i += 1) {
		sum += arr[i];
	}
	return sum;
};

// Calculate the summation of a through b (optionally using a callback function)
Calc.summation = Calc.sigma = function(a, b, fn) {
	var sum = 0, i;
	if (fn !== UNDEFINED) {
		// If function is defined, get sum of series
		for (i = a; i <= b; i += 1) {
			sum += fn(i);
		}
	} else {
		// Otherwise, add up numbers from a through b
		sum = (b - a + 1) * (a + b) / 2;
	}
	return sum;
};

// Approximate the Riemann sum of a function
Calc.riemann = function(fn, a, b) {
	var sum = 0,
		n = 1e5,
		dx = (b - a) / n,
		i;
	// Add up areas of all computed rectangles
	for (i = 1; i < n; i += 1) {
		sum += fn(a + (dx * i)) * dx;
	}
	return sum;
};

// Calculate the product of all numbers in an array
Calc.product = Calc.prod = function(arr) {
	var prod = 1, i, len;
	for (i = 0, len = arr.length; i < len; i += 1) {
		prod *= arr[i];
	}
	return prod;
};

// Calculate the arithmetic mean of all numbers in an array
Calc.mean = Calc.avg = function(arr) {
	return Calc.sum(arr) / arr.length;
};

// Calculate the geometric mean of all numbers in an array
Calc.geoMean = function(arr) {
	return pow(Calc.product(arr), (1 / arr.length));
};

// Calculate the median (middle value) of an array
Calc.median = function(arr) {
	var med, m1, m2, len;
	arr = Calc.sort(arr);
	len = arr.length;
	// If list has no true median
	if (len % 2 === 0) {
		m1 = arr[(len / 2) - 1];
		m2 = arr[(len / 2)];
		med = Calc.mean([m1, m2]);
	// But if it does...
	} else {
		med = arr[floor(len / 2)];
	}
	return med;
};

// Calculate the modes (most-recurring numbers) of an array
Calc.modes = Calc.mode = function(arr) {
	var map = [],
		modes = [],
		maxCount = 1,
		num, i, len;
	for (i = 0, len = arr.length; i < len; i += 1) {
		num = arr[i];
		if (map[num] === UNDEFINED) {
			map[num] = 1;
		} else {
			map[num] += 1;
		}
		if (map[num] > maxCount) {
			modes = [num];
			maxCount = map[num];
		} else if (map[num] === maxCount) {
			modes.unshift(num);
		}
	}
	// There are no modes if no repeating numbers are found
	if (modes.length === len) {
		modes = [];
	}
	return modes;
};

// Calculate the sample variance of all numbers in an array
// Pass in true as a 2nd argument to calculate population variance
Calc.variance = function(arr, pop) {
	var n = arr.length,
		mean = Calc.mean(arr),
		top = 0,
		bottom = n - 1,
		i;
	for (i = 0; i < n; i += 1) {
		top += pow(arr[i] - mean, 2);
	}
	// If population is chosen
	if (pop) {
		bottom = n;
	}
	return (top / bottom);
};

// Calculate the sample standard deviation of all numbers in an array
// Pass in true as a 2nd argument to calculate population stdDev
Calc.stdDev = function(arr, pop) {
	return sqrt(Calc.variance(arr, pop));
};


/* Geometry module */

// Calculate the slope of the line created by two given points
Calc.slope = function(pt1, pt2) {
	var slope = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
	if (slope === Infinity) {slope = NULL;}
	return slope;
};

// Calculate the distance of the two given points
Calc.distance = Calc.dist = function(pt1, pt2) {
	pt1 = pt1.slice(0);
	pt2 = pt2.slice(0);
	// Define z-value if omitted
	pt1[2] = pt1[2] || 0;
	pt2[2] = pt2[2] || 0;

	return sqrt(pow(pt2[0] - pt1[0], 2) + pow(pt2[1] - pt1[1], 2) + pow(pt2[2] - pt1[2], 2));
};

// Calculate the midpoint of the line created by two given points
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

// Calculate the hypotenuse of a and b
// CONSIDER: .hypotenuse alias
Calc.hypot = function(a, b) {
	return sqrt(pow(a, 2) + pow(b, 2));
};

// Calculate the difference of two squares
// CONSIDER: .squareDifference or .differenceOfSquares alias
Calc.sqDiff = function(a, b) {
	return pow(a, 2) - pow(b, 2);
};


/* Array module */

// Sort an array numerically (or using a callback function)
Calc.sorted = Calc.sort = function(arr, fn) {
	arr = arr.slice(0);
	if (fn && fn.call) {
		arr.sort(function(a, b) {
			return fn(a) > fn(b);
		});
	} else {
		arr.sort(function(a, b) {
			return a > b;
		});
	}
	return arr;
};

// Filter an array of items using a function
Calc.filtered = Calc.filter = function(arr, fn) {
	var filtered, i, len;
	if (arr.filter) {
		filtered = arr.filter(fn);
	} else {
		filtered = [];
		for (i = 0, len = arr.length; i < len; i += 1) {
			if (fn.call(arr, arr[i], i, arr)) {
				filtered.push(arr[i]);
			}
		}
	}
	return filtered;
};

// Create a new array derived from another (determined by a function)
Calc.map = function(arr, fn) {
	var mapped, i, len;
	if (arr.map) {
		mapped = arr.map(fn);
	} else {
		mapped = [];
		for (i = 0, len = arr.length; i < len; i += 1) {
			mapped.push(fn.call(arr, arr[i], i, arr));
		}
	}
	return mapped;
};

// Get the index of an item in an array
// CONSIDER: .indexOf alias
Calc.index = function(arr, item, fromIndex) {
	var index, i, len;
	if (arr.indexOf) {
		index = arr.indexOf(item, fromIndex);
	} else {
		index = -1;
		i = fromIndex || 0;
		for (len = arr.length; i < len; i += 1) {
			if (arr[i] === item) {
				index = i;
				break;
			}
		}
	}
	return index;
};

// Remove duplicates from an array
Calc.unique = function(arr) {
	return Calc.filtered(arr, function(value, key) {
		return (Calc.index(arr, value) === key);
	});
};

// Reverse the order of an array or string
Calc.reversed = Calc.reverse = function(operand) {
	var reversedOperand;
	if (operand.split) {
		reversedOperand = operand.split('');
		reversedOperand.reverse();
		return reversedOperand.join('');
	} else {
		reversedOperand = operand.slice(0);
		reversedOperand.reverse();
		return reversedOperand;
	}
};

// Flatten an array (reduce its hierarchy to one level)
Calc.flattened = Calc.flatten = function flatten(arr) {
	var flattened = [], i, len, toString;

	toString = Object.prototype.toString;
	for (i = 0, len = arr.length; i < len; i += 1) {

		if (toString.call(arr[i]) === '[object Array]') {
			// Recursively flatten nested arrays
			flattened = flattened.concat(flatten(arr[i]));
		} else {
			// Simply append items that aren't nested
			flattened.push(arr[i]);
		}

	}
	return flattened;
};

// Split the array into groups of n elements each
Calc.groups = Calc.grouped = function(arr, n) {
	var groups = [[]],
		remaining, i, len, lastGroup;

	// Convert the given string to an array if necessary
	if (typeof arr === 'string') {
		arr = arr.split('');
	}
	if (n === UNDEFINED) {
		n = 1;
	} else if (n === 0) {
		// Return empty array if n is zero
		return [];
	}

	lastGroup = groups[groups.length-1];
	for (i = 0, len = arr.length; i < len; i += 1) {

		if (lastGroup.length === n) {
			// Create new group if last group is large enough
			groups.push([]);
			lastGroup = groups[groups.length-1];
		}
		lastGroup.push(arr[i]);

	}

	// Check if there are still slots to fill
	if (lastGroup.length !== n) {
		// Calculate remaining number slots to fill
		remaining = n - lastGroup.length;
		for (i = 0; i < remaining; i += 1) {
			lastGroup.push(NULL); // REFACTOR?
		}
	}

	return groups;
};


/* Combinatorics module */

// Compute the factorial of an integer
// TODO: Implement gamma, integrals to compute decimal factorials
Calc.factorial = function(num) {
	var factorial = num, i;
	if (num === 0) {
		factorial = 1;
	} else if (num % 1 === 0) {
		for (i = 1; i < num; i += 1) {
			factorial *= i;
		}
	} else {
		factorial = NULL;
	}
	return factorial;
};

// Calculate the number of permutations from a set of r elements in a total of n elements
Calc.nPr = function(n, r) {
	if (n < r) {
		return 0;
	}
	return Calc.factorial(n) / Calc.factorial(n - r);
};

// Calculate the number of combinations from a set of r elements in a total of n elements
Calc.nCr = function(n, r) {
	if (n < r) {
		return 0;
	}
	return Calc.factorial(n) / (Calc.factorial(n - r) * Calc.factorial(r));
};

// Calculate all possible permutations of elements in an array
Calc.permutations = Calc.perms = Calc.permute = function(arr, n) {
	var arrIndices, perms, perm;

	// Array of calculated permutations
	perms = [];

	// If n is not given, permute entire array
	if (n === UNDEFINED) {
		n = arr.length;
	}

	// If input is string, convert it to array
	if (typeof arr === 'string') {
		arr = arr.split('');
	}

	// Filter callback
	function filterCallback(v, k) {
		return k;
	}
	// Create array of indices from input array
	arrIndices = Calc.map(arr, filterCallback);

	// Internal permute function
	function _permute(permIndices) {
		var items, i,
			mapCallback,
			filterCallback;

		// If permutation reaches the given length, use it
		if (permIndices.length === n) {

			// Map callback
			mapCallback = function(v) {
				return arr[v];
			};
			// Convert array of indices to array of items
			perm = Calc.map(permIndices, mapCallback);

			// Add permutation to list of permutations
			perms.push(perm);

		} else {

			// Filter callback
			filterCallback = function(v) {
				return (Calc.index(permIndices, v) === -1);
			};
			// Construct list of items that are not currently used
			items = Calc.filtered(arrIndices, filterCallback);

			for(i=0; i<items.length; i+= 1) {
				_permute(permIndices.concat(items[i]));
			}
		}

	}
	_permute([]);
	return perms;
};


/* Trigonometry module */

// Convert radians to degrees
Calc.degrees = function(angle) {
	return angle * (180 / PI);
};

// Convert degrees to radians
Calc.radians = function(angle) {
	return angle * (PI / 180);
};

// Convert angle to radian notation
Calc.radiansf = function(angle) {

	// Represent as fraction if possible
	var frac = Calc.frac(angle / PI);

	// If number is irrational, return it
	if (frac[0] % 1 !== 0 && frac[0] === 1) {
		return frac[0] + 'π';
	}

	// Format fraction in terms of pi
	frac = frac
		.join('/')
		// Multiply by pi
		.replace(/^(-)?1$/gi, '$1π')
		.replace(/\//gi, 'π/')
		// 1*pi is just pi
		.replace(/^(-)?1π/gi, '$1π')
		// x/1 is just x
		.replace(/\/1$/gi, '')
		// Ensure 0pi is just 0
		.replace(/^0π/gi, '0');

	return frac;
};

// Trig functions

// Sine
Calc.sin = Math.sin;
// Cosine
Calc.cos = Math.cos;
// Tangent
Calc.tan = Math.tan;

// Reciprocal trig functions

// Cosecant
Calc.csc = function(angle) {
	return 1 / Calc.sin(angle);
};
// Secant
Calc.sec = function(angle) {
	return 1 / Calc.cos(angle);
};
// Cotangent
Calc.cot = function(angle) {
	return 1 / Calc.tan(angle);
};

// Inverse trig functions

// Inverse sine
Calc.asin = Math.asin;
// Inverse cosine
Calc.acos = Math.acos;
// Inverse tangent
Calc.atan = Math.atan;
// Inverse tangent of the quotient of a and b
Calc.atan2 = Math.atan2;

// Inverse reciprocal trig functions

// Inverse cosecant
Calc.acsc = function(num) {
	return Calc.asin(1 / num);
};
// Inverse secant
Calc.asec = function(num) {
	return Calc.acos(1 / num);
};
// Inverse cotangent
Calc.acot = function(num) {
	return Calc.atan(1 / num);
};
// Inverse cotangent of the quotient of a and b
Calc.acot2 = function(a, b) {
	return Calc.atan2(b, a);
};

// Hyperbolic functions

// Hyperbolic sine
Calc.sinh = function(angle) {
	return (exp(angle) - exp(-angle)) / 2;
};
// Hyperbolic cosine
Calc.cosh = function(angle) {
	return (exp(angle) + exp(-angle)) / 2;
};
// Hyperbolic tangent
Calc.tanh = function(angle) {
	return (exp(angle) - exp(-angle)) / (exp(angle) + exp(-angle));
};

// Reciprocal hyperbolic functions

// Hyperbolic cosecant
Calc.csch = function(angle) {
	return 1 / Calc.sinh(angle);
};
// Hyperbolic secant
Calc.sech = function(angle) {
	return 1 / Calc.cosh(angle);
};
// Hyperbolic cotangent
Calc.coth = function(angle) {
	return 1 / Calc.tanh(angle);
};

// Inverse hyperbolic functions

// Inverse hyperbolic sine
Calc.asinh = function(num) {
	return log(num + sqrt(pow(num, 2) + 1));
};
// Inverse hyperbolic cosine
Calc.acosh = function(num) {
	return log(num + sqrt(pow(num, 2) - 1));
};
// Inverse hyperbolic tangent
Calc.atanh = function(num) {
	return log((1 + num) / (1 - num)) / 2;
};

// Inverse reciprocal hyperbolic functions

// Inverse hyperbolic cosecant
Calc.acsch = function(num) {
	return Calc.asinh(1 / num);
};
// Inverse hyperbolic secant
Calc.asech = function(num) {
	return Calc.acosh(1 / num);
};
// Inverse hyperbolic cotangent
Calc.acoth = function(num) {
	return Calc.atanh(1 / num);
};


/* Coordinate module */

// Find coterminal angle between 0 and 2pi (360 degrees)
Calc.coterminal = function(angle) {
	return angle - (2*PI) * Calc.floor(angle / (2*PI));
};

// Convert polar coordinates to rectangular
Calc.rect = Calc.cart = function(pt) {
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
	// Calculate quadrant using coterminal angle
	var quadrant = ceil((Calc.coterminal(angle) / (2*PI)) * 4);
	// Quadrant cannot be zero
	if (quadrant === 0) {
		quadrant = 1;
	}
	return quadrant;
};

// Find the reference angle of the given angle (distance from the x-axis)
Calc.refAngle = function(angle) {
	return abs(Calc.nearest(angle, PI) - angle);
};


/* Factor module */

// Get factors
Calc.factors = function(arr) {
	var common, min,
		factors = [1],
		f, i, len;

	if (!arr.push) {
		//If a number is given, wrap it in an array
		arr = [arr];
	} else {
		// Clone array
		arr = arr.slice(0);
	}

	// Keep only positive numbers
	for (i = 0, len = arr.length; i < len; i += 1) {
		if (arr[i] !== 0) {
			arr[i] = abs(arr[i]);
		} else {
			arr.splice(i, 1);
			i -= 1;
			len -= 1;
		}
	}

	if (arr.length) {

		min = Calc.max([Calc.min(arr), 2]);

		// Loop through all possible factors
		for (f = 2; f <= min; f += 1) {
			common = TRUE;
			for (i = 0; i < arr.length; i += 1) {
				// If number does not divide evenly, it is not a factor
				if (arr[i] % f !== 0) {
					// If factor is not a common factor, don't check factor against other numbers
					common = FALSE;
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
Calc.gcf = Calc.gcd = function(arr) {
	var factors = Calc.factors(arr);
	return factors[factors.length-1];
};

// Get least common multiple
Calc.lcm = Calc.lcd = function(arr) {
	var prod, lcm, common, m, i, len;
	prod = Calc.product(arr);

	// Loop through possible multiples
	for (m = 1; m < prod; m += 1) {
		common = TRUE;
		for (i = 0, len = arr.length; i < len; i += 1) {
			// If number is not a multiple, it is not an LCM
			if (m % arr[i] !== 0) {
				// If number is not an LCM, don't check number against other numbers
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

// Calculate the nth Fibonacci number
Calc.fib = function(n) {
	var a, b, i, last;
	a = 0;
	b = 1;

	if (n === 0) {
		b = 0;
	} else {
		for (i = 0; i < (n - 1); i += 1) {
			last = b;
			b = a + b;
			a = last;
		}
	}
	return b;
};

// Calculate the nth prime number
Calc.prime = function(n) {
	var i = 0,
		p = 0,
		prime,
		isPrime;

	for (i = 0; p <= n; i += 1) {
		isPrime = Calc.isPrime(i);
		if (isPrime) {
			prime = i;
			p += 1;
		}
	}
	return prime;
};


/* Representation module */

// Convert to fraction
Calc.fraction = Calc.frac = function(num) {
	var epsilon = 1e-12,
		numerator, absNum, d;

	// Cap number of operations at 50,000 for the sake of performance
	for (d = 1; d < 5e4; d += 1) {
		numerator = num * d;
		absNum = abs(numerator);
		// Check if the proposed numerator is close enough to an integer
		// This check will account for binary rounding error
		if ((absNum % 1) < epsilon || 1 - (absNum % 1) < epsilon) {
			// Stop when a numerator is found
			return [round(numerator), d];
		}
	}
	return [num, 1];
};

// Return a number as a formatted simplified fraction
Calc.fractionf = Calc.fracf = function(num) {
	var frac = Calc.frac(num);
	frac = frac
		.join('/')
		// x/1 is just x
		.replace(/\/1$/gi, '');
	return frac;
};

// Return the square root of a number as a simplified radical
Calc.radical = function(num) {
	var root, ans, factor, f, sign;

	// Capture sign of number to apply later
	sign = Calc.sign(num);
	num = abs(num);

	// Calculate square root
	root = sqrt(num);
	ans = [1, num];

	if (root % 1 === 0) {
		// If number is a perfect square, skip other steps
		ans = [root, 1];
	} else {
		// Loop through possible factors
		for (f = 2; f < num; f += 1) {
			factor = num / f;
			// If number is a factor
			if (factor % 1 === 0) {
				root = sqrt(factor);
				// If factor is also a perfect square, use it
				if (root % 1 === 0) {
					ans = [root, num / factor];
					break;
				}
			}
		}
	}

	// Ensure number's sign is kept
	ans[1] *= sign;

	return ans;
};

// Return the square root of a number as a formatted simplified radical
Calc.radicalf = function(num) {
	var rad = Calc.radical(num);
	rad = rad
		.join('√')
		// 1√x is just √x
		.replace(/1√/gi, '√')
		// The square root of a negative number is an imaginary number
		.replace(/√\-/gi, 'i√')
		// x√1 is just x
		.replace(/√1$/gi, '');
	if (rad === '') {
		rad = '1';
	}
	return rad;
};

// Convert number to comma-separated string
Calc.commas = function(num) {
	var parts = String(num).split('.');
	// Do not convert if number is exponential
	if (parts[0].indexOf('e') === -1) {
		parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	}
	return parts.join('.');
};

// Remove commas from a comma-separated number
Calc.noCommas = function(str) {
	str = str.replace(/,/gi, '');
	return parseFloat(str);
};


/* Condition module */

// Test if a number is even
Calc.isEven = function(num) {
	return (num % 2 === 0);
};

// Test if a number is odd
Calc.isOdd = function(num) {
	return (abs(num) % 2 === 1);
};

// Test if a number is an integer
Calc.isInteger = function(num) {
	return (num % 1 === 0);
};

// Test if a number is prime
Calc.isPrime = function(num) {
	var factors = Calc.factors(num);
	return (factors.length === 2);
};

// Test if a number is composite
Calc.isComposite = function(num) {
	num = abs(num);
	return (Calc.factors(num).length > 2);
};

// Test if a number is a factor of another number
Calc.isFactor = Calc.isFactorOf = function(factor, num) {
	return (num % factor === 0);
};

// If number is in Fibonacci sequence
Calc.isFib = function(num) {
	var ans, a, b;
	a = (5 * pow(num, 2)) + 4;
	// Accept zero as input
	if (num > 0) {
		b = (5 * pow(num, 2)) - 4;
	} else {
		b = a;
	}
	if (sqrt(a) % 1 === 0 || sqrt(b) % 1 === 0) {
		ans = TRUE;
	} else {
		ans = FALSE;
	}
	return ans;
};


/* Random Module */

// Get a random number or a random array index
// TODO: Remove the array functionality
Calc.rand = Calc.random = function(a, b) {
	if (a === UNDEFINED && b === UNDEFINED) {
		a = 0;
		b = 1;
	} else if (b === UNDEFINED) {
		b = a;
		a = 0;
	}
	// Get random index of the given array
	if (b.length) {
		return floor(b.length * random());
	}
	return a + (b - a) * random();
};

// Get a random integer
Calc.randInt = function(a, b) {
	return round(Calc.rand(a, b));
};

// Get a random selection of n items from an array
Calc.randChoices = Calc.choices = function(arr, n) {
	return Calc.scramble(arr).slice(0, n || 1);
};

// Get a random number from an array
Calc.randChoice = Calc.choice = function(arr) {
	return arr[Calc.random(arr)];
};

// Scramble an array of numbers
Calc.scrambled = Calc.scramble = function(arr) {
	var item, i;
	arr = arr.slice(0);
	for (i = 0; i < arr.length; i += 1) {
		item = arr[i];
		arr.splice(i, 1);
		arr.splice(Calc.random(arr), 0, item);
	}
	return arr;
};


/* Base module */

// Any base
Calc.base = function(num, base) {
	return num.toString(base);
};
// Decimal
Calc.decimal = Calc.dec = function(num, base) {
	return parseInt(num, base);
};
// Binary
Calc.binary = Calc.bin = function(num) {
	return num.toString(2);
};
// Octal
Calc.octal = Calc.oct = function(num) {
	return num.toString(8);
};
// Hexadecimal
Calc.hex = function(num) {
	return num.toString(16);
};


/* Boolean module */

// Logical NOT
Calc.not = function(bool) {
	return !bool;
};
// Logical AND
Calc.and = function(bool1, bool2) {
	return (!!bool1 && !!bool2);
};
// Logical OR
Calc.or = function(bool1, bool2) {
	return (!!bool1 || !!bool2);
};
// Logical XOR
Calc.xor = function(bool1, bool2) {
	return ((!!bool1 || !!bool2) && (bool1 !== bool2));
};
// Logical NAND
Calc.nand = function(bool1, bool2) {
	return !(!!bool1 && !!bool2);
};
// Logical NOR
Calc.nor = function(bool1, bool2) {
	return !(!!bool1 || !!bool2);
};


/* Matrix module */

// Matrix constructor
function Matrix(m1) {
	if (m1 && m1.constructor === Matrix) {
		m1 = m1.matrix.slice(0);
	} else if (m1 === UNDEFINED) {
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
	var arr = [], r, len;
	for (r = 0, len = m1.length; r < len; r += 1) {
		arr.push(m1[r][c]);
	}
	return arr;
}

// Get number of rows/columns
function _rows(m1) {
	return m1.length;
}
function _cols(m1) {
	if (m1.length === 0) {
		return 0;
	}
	return m1[0].length;
}

// Cross out row/column in matrix (internal)
function _crossout(m1, pt) {
	var r, c, nrows, ncols;
	m1 = m1.slice(0);
	m1.splice(pt[0], 1);
	for (r = 0, nrows = m1.length; r < nrows; r += 1) {
		m1[r] = m1[r].slice(0);
		for (c = 0, ncols = m1[r].length; c < ncols; c += 1) {
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
		cols = _cols(m1),
		sub,
		ans = 0, c;
		for (c = 0; c < cols; c += 1) {
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
		r, c, nrows, ncols;
	for (r = 0, nrows = m1.length; r < nrows; r += 1) {
		for (c = 0, ncols = m1[r].length; c < ncols; c += 1) {
			m1[r][c] *= scalar;
		}
	}
	return Calc.matrix(m1);
};

// Matrix traversal

// Get the nth row
matrix.row = function(r) {
	return _row(this.matrix, r);
};

// Get the nth column
matrix.col = function(c) {
	return _col(this.matrix, c);
};

// Get the nth element
matrix.value = function(index) {
	var m1 = this.matrix,
		cols = _cols(m1),
		row = ceil(index / cols) - 1,
		col = index % cols;

	return (m1[row] ? m1[row][col] : UNDEFINED);
};

// Get the index of the first element with the given value
matrix.index = function(value) {
	var m1 = this.matrix,
		rows = _rows(m1),
		cols = _cols(m1),
		r, c;
	for (r = 0; r < rows; r += 1) {
		for (c = 0; c < cols; c += 1) {
			if (m1[r][c] === value) {
				return (r * cols) + c;
			}
		}
	}
	return NULL;
};

// Count number of rows
matrix.nrows = matrix.rows = function() {
	return _rows(this.matrix);
};

// Count number of columns
matrix.ncols = matrix.cols = function() {
	return _cols(this.matrix);
};

// Count number of elements
matrix.nvalues = matrix.values = function() {
	var m1 = this.matrix;
	return _rows(m1) * _cols(m1);
};

// Add matrices
matrix.add = function(m2) {
	var m1 = this.matrix,
		r, c, nrows, ncols, ans = [];
	m2 = Calc.matrix(m2).matrix;
	// Only matrices of the same dimensions can be added
	if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
		return NULL;
	}
	for (r = 0, nrows = m1.length; r < nrows; r += 1) {
		ans[r] = [];
		for (c = 0, ncols = m1[r].length; c < ncols; c += 1) {
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
		productRows,
		ans = [];
	// If matrices cannot be multiplied
	if (m1[0].length !== m2.length) {
		return NULL;
	}
	// Loop through resultant rows
	for (r = 0; r < rows; r += 1) {
		ans[r] = [];
		// Loop through resultant's columns
		for (c = 0; c < cols; c += 1) {
			n = 0;
			// Match up row from matrix 1 with column from matrix 2
			row = _row(m1, r);
			col = _col(m2, c);
			for (rr = 0, productRows = row.length; rr < productRows; rr += 1) {
				n += (row[rr] * col[rr]);
			}
			ans[r][c] = n;
		}
	}
	return Calc.matrix(ans);
};

// Calculate determinant of a matrix
matrix.det = matrix.determinant = function() {
	var m1 = this.matrix,
		rows = _rows(m1),
		cols = _cols(m1),
		det;
	if (rows === 1 && cols === 1) {
		det = m1[0][0];
	} else if (rows > 1 && cols > 1) {
		det = _det(m1);
	} else {
		det = NULL;
	}
	return det;
};

// Transpose (reflect) matrix
matrix.transpose = matrix.reflect = function() {
	var m1 = this.matrix,
		rows = _rows(m1),
		cols = _cols(m1),
		reflected = [], r, c;
	for (c = 0; c < cols; c += 1) {
		reflected[c] = [];
		for (r = 0; r < rows; r += 1) {
			reflected[c][r] = m1[r][c];
		}
	}
	return Calc.matrix(reflected);
};

// Get cofactors of a matrix
matrix.cofactors = function() {
	var m1 = this.matrix,
		rows = _rows(m1),
		cols = _cols(m1),
		factors = [],
		rsign = 1, csign,
		sub, r, c;
	m1 = m1.slice(0);

	for (r = 0; r < rows; r += 1) {
		csign = rsign;
		factors[r] = [];
		for (c = 0; c < cols; c += 1) {
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
	return this.transpose().cofactors();
};

// Calculate inverse
matrix.inverse = matrix.inv = function() {
	var inst = this,
		m1 = inst.matrix,
		rows = _rows(m1),
		cols = _cols(m1),
		det = inst.det(),
		inv;
	if (rows === 1 && cols === 1) {
		inv = [[ 1 / m1[0][0] ]];
	} else if (rows > 1 && cols > 1) {
		if (det) {
			inv = inst.adjugate().scale(1 / det);
		} else {
			return NULL;
		}
	}
	return Calc.matrix(inv);
};

// Construct identity matrix from input matrix
matrix.identity = matrix.iden = function() {
	var inst = this,
		m1 = inst.matrix,
		cols = _cols(m1),
		iden = [],
		r, c,
		d = 0,
		value;

	for (r = 0; r < cols; r += 1) {
		iden[r] = [];
		for (c = 0; c < cols; c += 1) {
			if (c === d) {
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
};


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
// Create vector
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


/* Set module */

// Set constructor
function Set(s1) {
	if (s1 && s1.constructor === Set) {
		s1 = s1.set.slice(0);
	} else if (s1 === UNDEFINED) {
		s1 = [];
	}
	this.set = Calc.unique(s1.slice(0));
}
Calc.set = function(s1) {
	return new Set(s1);
};
var set = Set.prototype;

// Get union of two sets
set.union = function(s2) {
	var s1 = this.set;
	s2 = Calc.set(s2).set;
	return Calc.set(s1.concat(s2));
};

// Get intersection of tow sets
set.intersection = set.intersect = function(s2) {
	var s1 = this.set;
	s2 = Calc.set(s2).set;
	return Calc.set(Calc.filtered(s1, function(v) {
		return Calc.index(s2, v) !== -1;
	}));
};

// Get difference of two sets
set.difference = set.diff = function(s2) {
	var s1 = this.set;
	s2 = Calc.set(s2).set;
	return Calc.set(Calc.filtered(s1, function(v) {
		return (Calc.index(s2, v) === -1);
	}));
};

// Get symmetric difference of two sets
set.symDiff = function(s2) {
	var s1 = this;
	s2 = Calc.set(s2);
	return s1.union(s2).diff(s1.intersection(s2));
};

// Tests if two sets are equal
set.equals = function(s2) {
	var s1 = this.set, i;
	s2 = Calc.set(s2).set;
	if (s1.length === s2.length) {
		for (i = 0; i < s1.length; i += 1) {
			if (Calc.index(s2, s1[i]) === -1) {
				return FALSE;
			}
		}
		return TRUE;
	}
	return FALSE;
};

}(self, Math, parseFloat, parseInt, String, true, false, null));
