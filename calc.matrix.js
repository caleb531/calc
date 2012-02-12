(function() {

/* Matrix module */

function getRow(m, r) {
	return m[r];
}
function getCol(m, c) {
	var arr = [], r;
	for (r=0; r<m.length; r+=1) {
		arr.push(m[r][c]);
	}
	return arr;
}

// Scalar matrix
Calc.mScale = function(m1, scalar) {
	var r, c;
	m1 = m1.slice(0);
	for (r=0; r<m1.length; r+=1) {
		for (c=0; c<m1[r].length; c+=1) {
			m1[r][c] *= scalar;
		}
	}
	return m1;
};

// Add two matrices
Calc.mAdd = function(m1, m2) {
	var r, c, ans = [];
	if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
		return null;
	}
	for (r=0; r<m1.length; r+=1) {
		ans[r] = [];
		for (c=0; c<m1.length; c+=1) {
			ans[r][c] = (m1[r][c] + m2[r][c]);
		}	
	}
	return ans;
}

// Subtract
Calc.mSubtract = function(m1, m2) {
	return Calc.mAdd(m1, Calc.mScale(m2, -1));
};

Calc.mMultiply = function(m1, m2) {
	var r, c, rr, n, ans = [],
		row, col,
		rows = m1.length,
		cols = m2[0].length;
	// If matrices cannot be multiplied
	if (m1[0].length !== m2.length) {return null;}
	// Loop through resultant rows
	for (r=0; r<rows; r+=1) {
		ans[r] = [];
		// Loop through resultant's columns
		for (c=0; c<cols; c+=1) {
			n = 0;
			// Match up row from matrix 1 and column from matrix 2
			row = getRow(m1, r);
			col = getCol(m2, c);
			for (rr=0; rr<row.length; rr+=1) {
				n += (row[rr] * col[rr]);
				if (isNaN(n)) {return null;}
			}
			ans[r][c] = n;
		}	
	}
	return ans;
}

Calc.det2 = function(m) {
	return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

Calc.det3 = function(m) {

	var a = m[0][0],
		b = m[0][1],
		c = m[0][2],
		d = m[1][0],
		e = m[1][1],
		f = m[1][2],
		g = m[2][0],
		h = m[2][1],
		i = m[2][2];
		
	return (
		a * det2([ [e, f], [h, i] ]) -
		b * det2([ [d, f], [g, i] ]) +
		c * det2([ [d, e], [g, h] ])
	);
}

}());