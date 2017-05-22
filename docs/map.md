## `map()`

Returns a new list, the values of which are derived from the old list using a function.

The function itself accepts three arguments:

  1. The item of the current iteration
  2. The index of the current iteration
  3. The array itself

```javascript
var list = [1, 2, 3, 4, 5];

// Return the squares of each item in the list
Calc.map(list, function(v, k, arr) {
  return Calc.pow(v, 2);
});
// [1,4,9,16,25]
```
