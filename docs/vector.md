## `vector()`

Returns a `Vector` object, which contains methods for manipulating vectors.

The `vector()` method accepts a list of x-, y-, or z- values.

```javascript
Calc.vector([3, 4]);
```

A third value of the vector defines its position on the z-axis. If you omit this value, it will default to `0`.

```javascript
Calc.vector([3, 4, 1]);
```

To retrieve the vector as an array, use the `vector` property of the `Vector` object.

```javascript
Calc.vector([3, 4]).vector;
```

### mag()

Returns the magnitude (length) of the vector.

```javascript
Calc.vector([3, 4]).mag();
// 5
```

### angle()

Returns the angle (direction) of the vector.

```javascript
Calc.vector([3, 4]).angle();
// 0.9272952180016122
```

### add()

Returns the sum of a vector and another vector.

```javascript
Calc.vector([1, 2]).add([3, 4]).vector;
// [4,6,0]
```

### subtract()

Returns the difference of a vector and another vector.

```javascript
Calc.vector([1, 2]).subtract([3, 4]).vector;
// [-2,-2,0]
```

### scale()

Returns the product of a vector and a number.

```javascript
Calc.vector([3, 4]).scale(2).vector;
// [6,8,0]
```

### dot()

Returns the dot product of two vectors (which is a number).

```javascript
Calc.vector([3, 4]).dot([5, 6]);
// 39
```

### cross()

Returns the cross product of two vectors (which is also a vector).

```javascript
Calc.vector([3, 4, 2]).cross([5, 6, 3]).vector;
// [0,1,-2]
```

