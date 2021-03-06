'use strict';

// var config = require('../config.js');
var gulp = require('gulp');
var livereload = require('gulp-livereload');

// Watch
gulp.task('watch', ['build'], function () {
  // var server = livereload();
  //   // Watch for changes in `app` folder
  //   gulp.watch([
  //       // 'app/jade/**/*.jade',
  //       // 'app/*.html',
  //       // 'app/scss/**/*.scss',
  //       // 'app/scripts/**/*.js',
  //       // 'app/images/**/*',
  //       '.tmp/**/*'
  //   ]).on('change', function(file) {
  //     server.changed(file.path);
  //   });

    // Watch .less files
    gulp.watch('app/less/**/*.less', ['styles']);

    // Watch .js files
    gulp.watch(['app/**/*.js', 'app/scripts/**/*.jsx'], ['browserify']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);

    // Watch .html files
    gulp.watch('app/**/*.html', ['html']);
});
