## `loop()`

Runs a callback function within a set of nested loops. The method parameters are as follows:

  1. The number of loops
  2. The number of iterations per loop
  3. A callback function

```javascript
// Create three loops that iterate twice
Calc.loop(3, 5, function() {
  // do something
});
```

Internally, the method will create a loop structure similar to this:

```javascript
for (var a = 0; a < 5; a += 1) {
  for (var b = 0; b < 5; b += 1) {
    for (var c = 0; c < 5; c +=1 ) {
     // your callback function here
    }
  }
}
```
