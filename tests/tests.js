module( 'Calc Configs' );
test( 'noConflict()', function () {
	
	// Setup
	window.CalcAlias = window.Calc;
	Calc = { foo: 'bar' };
	
	var AnotherAlias = CalcAlias.noConflict();
	strictEqual( Calc.foo, 'bar', 'Restores.' );
	ok( AnotherAlias.noConflict, 'Creates aliases.' );
	
	// Teardown
	Calc = CalcAlias.noConflict();
});

module( 'Number Module' );
test( 'rounded()', function () {
	strictEqual( Calc.rounded(1.6), 2, 'Rounds up.' );
	strictEqual( Calc.rounded(1.5), 2, 'Rounds up from middle.' );
	strictEqual( Calc.rounded(1.4), 1, 'Rounds down.' );
});
test( 'nearest()', function () {
	strictEqual( Calc.nearest(23, 5), 25, 'Rounds up.' );
	strictEqual( Calc.nearest(22.5, 5), 25, 'Rounds up from middle.' );
	strictEqual( Calc.nearest(22, 5), 20, 'Rounds down.' );
});
test( 'mod()', function () {
	strictEqual( Calc.mod(5, 4), 1, 'Mods positive.' );
	strictEqual( Calc.mod(-5, 4), 3, 'Mods negative.' );
});
test( 'chopped()', function () {
	strictEqual( Calc.chopped(1.1), 1, 'Chops positive.' );
	strictEqual( Calc.chopped(-1.1), -1, 'Chops negative.' );
});
test( 'sign()', function () {
	strictEqual( Calc.sign(1), 1, 'Positive sign.' );
	strictEqual( Calc.sign(0), 0, 'Zero sign.' );
	strictEqual( Calc.sign(-1), -1, 'Negative sign.' );
});
test( 'toZero()', function () {
	strictEqual( Calc.toZero(21, 20), 1, 'Zeroes down.' );
	strictEqual( Calc.toZero(-21, 20), -1, 'Zeroes up.' );
	strictEqual( Calc.toZero(-21, 21), 0, 'Zeroes to zero.' );
	strictEqual( Calc.toZero(-21, 22), 1, 'Zeroes up past zero.' );
});
test( 'correct()', function () {
	strictEqual( Calc.correct(1.0 + 2.0), 3.0, 'Corrects.' );
});

module( 'Exponent Module' );
test( 'root()', function () {
	strictEqual( Calc.root(1, 1), 1, '1^1' );
	strictEqual( Calc.root(1, 2), 1, '1^(1/2)' );
	strictEqual( Calc.root(25, 2), 5, '25^(1/2)' );
	strictEqual( Calc.root(125, 3), 5, '125^(1/2)' );
});