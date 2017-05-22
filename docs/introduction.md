## Introduction

### Importing Calc

Calc has no dependencies, To include it in your web page, you only need to include the appropriate script tag in your HTML. After doing so, you can begin using Calc.

```html
<script src="calc.min.js"></script>
```

Calc can also be easily imported into [web workers](https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers) to allow for asynchronous computation.

```javascript
importScripts("calc.min.js");
```

### Using Calc

All properties and methods are accessed through a global object called `Calc`.

```javascript
Calc.round(3.5);
// 4
Calc.factorial(4);
// 24
```

