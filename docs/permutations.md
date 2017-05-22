## `permutations()`

*Aliases:* `perms()`, `permute()`

Returns a list of all possible permutations within a given list. Each permutation is also a list.

```javascript
Calc.permutations(['a', 'b', 'c']);
// [["a","b","c"],["a","c","b"],["b","a","c"],["b","c","a"],["c","a","b"],["c","b","a"]]
Calc.permutations(['a', 'b', 'c']).length;
// 6
```

You may also specify an integer indicating the number of list items per individual permutation

```javascript
Calc.permutations(['a', 'b', 'c'], 2);
// [["a","b"],["a","c"],["b","a"],["b","c"],["c","a"],["c","b"]]
Calc.permutations(['a', 'b', 'c'], 2).length;
// 6
```

For convenience, the method also accepts a string as input. However, each permutation will remain a list

```javascript
Calc.permutations('abc');
// [["a","b","c"],["a","c","b"],["b","a","c"],["b","c","a"],["c","a","b"],["c","b","a"]]
Calc.permutations('abc').length;
// 6
```
