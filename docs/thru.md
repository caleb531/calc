## `thru()`

Generates a list of integers starting based on a given starting and ending number.

Passing one argument will generate every integer from 0 through *b*.

```javascript
Calc.thru(10);
// [0,1,2,3,4,5,6,7,8,9,10]
```

Passing two argument will generate every integer from *a* through *b*.

```javascript
Calc.thru(2, 10);
// [2,3,4,5,6,7,8,9,10]
```

Passing a third argument will increment every *n* integers.

```javascript
Calc.thru(3, 10, 2);
// [3,5,7,9]
```

