var path = require('path');
var production = (process.env.NODE_ENV === 'production');

module.exports = {
  bower: 'app/bower_components',
  dist: production ? 'dist' : '.tmp',
	root: path.resolve('./')
};
