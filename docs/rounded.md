## `rounded()`

Alias: `round()`

Returns a number rounded to the closest integer.

```javascript
Calc.rounded(3.6);
// 4
Calc.rounded(3.1);
// 3
Calc.rounded(-3.5);
// -3
```

Additionally, you can round the number to `n` decimal places:

```javascript
Calc.rounded(Calc.PI, 3);
// 3.142
Calc.rounded(Calc.E, 2);
// 2.72
Calc.rounded(4, 5);
// 4
```

