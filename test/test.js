var volume = require("rle-sample").solid.dense([-6,-6,-6], [7,7,7], function(x) {
  return Math.sqrt(x[0]*x[0]+x[1]*x[1]+x[2]*x[2]) - 5.0;
});
require("../index.js")(volume).pipe(process.stdout)
