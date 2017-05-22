## `summation()`

*Aliases:* `sigma()`

Returns the computed sum of all numbers from *a* through *b*.

```javascript
Calc.summation(1, 100);
// 5050
```

An optional function may be passed, in which case the method will compute the sum of the results of the function.

For instance, the example below will compute the sum of the squares from 1 through 5.

```javascript
Calc.summation(1, 5, function(x) {
  return Calc.pow(x, 2);
});
// 55
```

