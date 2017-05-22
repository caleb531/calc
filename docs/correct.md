## `correct()`

Corrects a number's binary rounding error, while maintaining its original precision.

```javascript
Calc.correct(0.1 + 0.2);
// 0.3
Calc.correct(0.2 + 0.4);
// 0.6
Calc.correct(0.41 + 0.25);
// 0.66
Calc.correct(1/3) * 3;
// 1
```

