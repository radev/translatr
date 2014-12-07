'use strict';

var gulp = require('gulp');

gulp.task('serve', ['watch'], function() {
  require('../../bin/www');
});
