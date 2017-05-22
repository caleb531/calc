## `atan2()`

Returns the arc tangent of the quotient of *a* and *b*.

The `atan2()` method may return an angle in any quadrant, unlike the [`atan()`](/calc/docs/atan/) method).

```javascript
Calc.radiansf(Calc.atan2(1, -1));
// "3π/4"
Calc.degrees(Calc.atan2(1, -1));
// 135
```

```javascript
Calc.radiansf(Calc.atan2(-1, 1));
// "-π/4"
Calc.degrees(Calc.atan2(-1, 1));
// -45
```

