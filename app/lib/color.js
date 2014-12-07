var colorString = require("color-string");
var convert = require("color-convert");

module.exports.getMatching = function(hex) {
  var luma = convert().rgb(colorString.getRgb(hex)).hsl()[2];
  if (luma<50) {
    return '#ffffff';
  } else {
    return '#404040';
  }
};
