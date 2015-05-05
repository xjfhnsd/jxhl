var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint')
  
var config = {
  mangle: { except: ['define', 'require', 'module', 'exports'] },
  compress: false
};

gulp.task('minify', function () {
  gulp.src('src/*.js')
    .pipe(uglify(config))
    .pipe(jshint())
    .pipe(gulp.dest('dest'));
});

gulp.task('watch', function () {
  gulp.watch('src/*.js', ['minify']);
});

gulp.task('default', ['minify', 'watch']);