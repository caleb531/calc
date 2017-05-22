## `sorted()`

*Aliases:* `sort()`

Sorts an array in ascending order.

This method does not change the original list.

```javascript
Calc.sorted([10, 1, 7, 5, 8]);
// [1,5,7,8,10]
```

The method also accepts an additional argument, which is a callback function by which the numbers will be sorted.

The example below will sort the numbers based on the value of their reciprocals.

```javascript
Calc.sorted([10, 1, 7, 5, 8], function(num) {
  return 1 / num;
});
// [10,8,7,5,1]
```

