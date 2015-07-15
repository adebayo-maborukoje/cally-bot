 var gulp = require('gulp'),
  nodemon = require('gulp-nodemon');
gulp.task('cally', function() {
  nodemon({
    script: 'shell.js'
  });
});


//copied Ladi's post on slack in case we might need it later on
gulp.task('keep-alive', function () {
  var env = process.env.NODE_ENV || 'development';

  if (env === 'production') {
    var apiHost = process.env.API_URL || 'http://localhost:5555';
    setInterval(function() {
      request.get(apiHost + '/keep-alive', {}, function (err, res, body) {
        if (err) {
          return err;
        }
        console.log('This is the response from the API server: ', body);
      });
    }, 300000);
  }
});


gulp.task('default', ['cally', 'keep-alive']);
