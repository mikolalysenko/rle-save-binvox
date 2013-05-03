rle-save-binvox
===============
Exports a [narrowband level set](http://github.com/mikolalysenko/rle-core) to [binvox format](http://www.cs.princeton.edu/~min/binvox/). 


Example
=======
Here is a simple script showing how you can create a binvox model of a sphere:

```javascript
var volume = require("rle-sample").solid.dense([-6,-6,-6], [7,7,7], function(x) {
  return Math.sqrt(x[0]*x[0]+x[1]*x[1]+x[2]*x[2]) - 5.0;
});
require("rle-save-binvox")(volume).pipe(process.stdout)
```

This will pipe a binvox file to stdout.  Using [viewvox](http://www.cs.princeton.edu/~min/viewvox/) to check the result gives the following mesh:


Install
=======

    npm install rle-save-binvox
    
### `require("rle-save-binvox")(volume[, bounds, translate, scale])`
Returns a stream encoding the binvox file.

* `volume` is an rle narrowband level set
* `bounds` is a bound on the range of the level set to save (if not specified is computed using rle-extents)
* `translate` is the translation parameter in the binvox file
* `scale` is the scale parameter in the binvox file

# Credits
(c) 2013 Mikola Lysenko. MIT License
