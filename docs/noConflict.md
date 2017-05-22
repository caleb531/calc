## `noConflict()`

The `noConflict()` method relinquishes hold of the `Calc` variable, setting it back to its original value.

The method returns the `Calc` object, which can be assigned to another variable.

```javascript
var newCalc = Calc.noConflict();
window.Calc;
// undefined
```

