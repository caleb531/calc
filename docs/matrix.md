## `matrix()`

Returns a `Matrix` object, which contains methods for manipulating matrices.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]);
```

To retrieve the matrix as an array, use the `matrix` property of the `Matrix` object.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).row(0);
// [1,2]
```

### row()

Returns the nth row of the matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).col(0);
// [1,3]
```

### col()

Returns the nth column of the matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).col(0);
// [1,3]
```

### .value()

*Aliases:* `nvalues()`

Returns the value of the nth element of the matrix.

```javascript
Calc.matrix([
  [5, 6],
  [7, 8]
]).value(2);
// 5
```

### index()

Returns the index of the element of the matrix with the given value.

```javascript
Calc.matrix([
  [5, 6],
  [7, 8]
]).index(7);
// 2
```

### .rows()

*Aliases:* `nrows()`

Returns the number of rows of the matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).rows();
// 2
```

### .cols()

*Aliases:* `ncols()`

Returns the number of columns of the matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).cols();
// 2
```

### .values()

*Aliases:* `values()`

Returns the number of elements of the matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).values();
// 4
```

### add()

Returns the sum of two matrices.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).add([
  [5, 6],
  [7, 8]
]).matrix;
// [[6,8],[10,12]]
```

### subtract()

Returns the difference of two matrices.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).subtract([
  [5, 6],
  [7, 8]
]).matrix;
// [[-4,-4],[-4,-4]]
```

### multiply()

Returns the products of two matrices.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).multiply([
  [5, 6],
  [7, 8]
]).matrix;
// [[19,22],[43,50]]
```

### scale()

Returns the product of a matrix and a number.

```javascript
Calc.matrix(
  [[1, 2], [3, 4]]
).scale(2).matrix;
// [[2,4],[6,8]]
```

### .determinant() 

*Aliases:* `det()`

Returns the determinant of a matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).determinant();
// -2
```

### .transpose()

*Aliases:* `reflect()`

Returns the transpose of a matrix (the rows and columns are swapped).

```javascript
Calc.matrix([
  [1, 2, 3],
  [4, 5, 6]
]).transpose().matrix;
// [[1,4],[2,5],[3,6]]
```

### cofactors()

Returns the cofactor matrix of a matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).cofactors().matrix;
// [[4,-3],[-2,1]]
```

### .adjugate()

*Aliases:* `adj()`

Returns the adjugate of a matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).adjugate().matrix;
// [[4,-2],[-3,1]]
```

### .inverse()

*Aliases:* `inv()`

Returns the inverse of a matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).inverse().matrix;
// [[-2,1],[1.5,-0.5]]
```

```javascript
Calc.matrix([
  [1, 2, 3],
  [0, 1, 4],
  [5, 6, 0]
]).inverse().matrix;
// [[-24,18,5],[20,-15,-4],[-5,4,1]]
```

### .identity()

*Aliases:* `iden()`

Returns the corresponding identity matrix of a matrix.

```javascript
Calc.matrix([
  [1, 2],
  [3, 4]
]).identity().matrix;
// [[1,0],[0,1]]
```

```javascript
Calc.matrix([
  [1, 2, 4],
  [4, 5, 6]
]).identity().matrix;
// [[1,0,0],[0,1,0],[0,0,1]]
```

