## `fractionf()`

*Aliases:* `fracf()`

Returns a string of a number as a simplified fraction.

```javascript
Calc.fractionf(1.5);
// "3/2"
Calc.fractionf(-2.4);
// "-12/5"
```

If the number cannot be represented as a fraction, the method returns the decimal as a string.

```javascript
Calc.fractionf(Calc.E);
// "2.718281828459045"
```

If you prefer the actual fraction values rather than a string, see the [`fraction()`](/calc/docs/fraction/) method.

