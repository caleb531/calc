## `random()`

*Aliases:* `rand()`

Returns a random decimal number between `a` and `b` (`a` and `b` default to 0 and 1).

```javascript
Calc.random();
// 0.1168003953062
Calc.random(5);
// 3.8679374323692173
Calc.random(10, 20);
// 15.86298251291737
```

The method will also return a random array index, if given a array.

```javascript
Calc.random(['a', 'b', 'c']);
// 2
```

If you want to receive a random integer instead, see the [`randInt()`](/calc/docs/randInt/) method.

