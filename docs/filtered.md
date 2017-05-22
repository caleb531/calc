## `filtered()`

*Aliases:* `filter()`

Returns a list filtered using a function. If the function returns `true`, the item is kept. If the function returns `false`, the item is removed.

The function itself accepts three arguments:

  - The item of the current iteration
  - The index of the current iteration
  - The array itself

```javascript
var list = [12, 17, 24, 36, 43, 71];

// Return only the prime numbers from the list
Calc.filtered(list, function(value, key) {
  return Calc.isPrime(value);
});
// [17,43,71]
```
