"use strict"

var extents = require("rle-extents")
var through = require("through")

function pass_write(d) {
  this.queue(d)
}

function pass_end() {
  this.queue(null)
}

//Binvox uses a rotated coordinate system
var BINVOX_ORDER = [2, 1, 0]

//Converts volume to a binvox stream
function toBinvoxStream(volume, bounds, translate, scale) {
  var result = through(pass_write, pass_end)
  var i
  if(!bounds) {
    bounds = extents(volume)
    for(var i=0; i<3; ++i) {
      bounds[0][i] -= 2
      bounds[1][i] += 2
    }
  }
  process.nextTick(function() {
    //Write header
    result.write("#binvox 1\n")
    var size = [0, 0, 0]
    for(i=0; i<3; ++i) {
      size[i] = bounds[1][i] - bounds[0][i]
    }
    result.write("dim " + size[BINVOX_ORDER[0]] + " " + size[BINVOX_ORDER[1]] + " " + size[BINVOX_ORDER[2]] + "\n")
    if(translate) {
      result.write("translate " + translate[BINVOX_ORDER[0]] + " " + translate[BINVOX_ORDER[1]] + " " + translate[BINVOX_ORDER[2]] + "\n")
    } else {
      result.write("translate 0 0 0\n")
    }
    if(scale) {
      result.write("scale " + scale + "\n")
    } else {
      result.write("scale 1.0\ndata\n")
    }
    var array = []
    var n = volume.length()
    var phases = volume.phases
    var coords = volume.coords
    var cx = bounds[0][0]
    var cy = bounds[0][1]
    var cz = bounds[0][2]
    var count = 0
    for(i=0; i<n-1; ) {
      var p = phases[i]
      while(i < n-1 && phases[i] === p) {
        ++i
      }
      var nx = Math.max(Math.min(coords[0][i], bounds[1][0]), bounds[0][0])
      var ny = Math.max(Math.min(coords[1][i], bounds[1][1]), bounds[0][1])
      var nz = Math.max(Math.min(coords[2][i], bounds[1][2]), bounds[0][2])
      if(i === n-1) {
        nx = bounds[1][0]
        ny = bounds[1][1]-1
        nz = bounds[1][2]-1
      }
      var len
      if(nz > cz) {
        len = nx - cx + size[0] * (ny - cy + size[1] * (nz - cz))
      } else if(ny > cy) {
        len = nx - cx + size[0] * (ny - cy)
      } else {
        len = nx - cx
      }
      count += len
      //Write run
      while(len > 255) {
        array.push(p)
        array.push(255)
        len -= 255
      }
      if(len > 0) {
        array.push(p)
        array.push(len)
      }
      cx = nx
      cy = ny    
      cz = nz
    }
    result.write(new Buffer(array))
    result.write(null)
    result.end()
  })
  return result
}
module.exports = toBinvoxStream
