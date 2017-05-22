## `groups()`

*Aliases:* `grouped()`

Splits the array into groups of *n* elements each

```javascript
// Create a series of 3-number groups
Calc.groups([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
// [[1,2,3],[4,5,6],[7,8,9]]
```

The `groups()` method also accepts a string value (as opposed to an array).

```javascript
// Create a series of 3-number groups
Calc.groups('Hello', 3);
// [["H","e","l"],["l","o",null]]
```

### Notes

All array subgroups are exactly the same size (*n* elements). Any leftover array slots are filled in with the value `null`.

```javascript
Calc.groups('abc', 2);
// [["a","b"],["c",null]]
```

