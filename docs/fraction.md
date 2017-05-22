## `fraction()`

*Aliases:* `frac()`

Returns an array of a number as a simplified fraction. The first item of the array is the numerator, and the last item is the denominator.

```javascript
Calc.fraction(1.5);
// [3,2]
Calc.fraction(-2.4);
// [-12,5]
Calc.fraction(0.1 + 0.2);
// [3,10]
```

If the number cannot be represented as a fraction, the method returns the decimal over 1.

```javascript
Calc.fraction(Calc.E);
// [2.718281828459045,1]
```

### Notes

If you prefer the standard fraction notation (a/b), see the [`fractionf()`](/calc/docs/fractionf/) method.

