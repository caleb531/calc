## `acot2()`

Returns the arc tangent of the quotient of *a* and *b*.

The `acot2()` method may return an angle in any quadrant, unlike the [`acot()`](/calc/docs/acot/) method).

```javascript
Calc.radiansf(Calc.acot2(1, -1));
// "-π/4"
Calc.degrees(Calc.acot2(1, -1));
// -45
```

```javascript
Calc.radiansf(Calc.acot2(-1, 1));
// "3π/4"
Calc.degrees(Calc.acot2(-1, 1));
// 135
```
