var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');
gulp.task('cally', function(){
  nodemon({
    script: 'shell.js'
  });
});
gulp.task('default', ['cally']);