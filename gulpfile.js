var gulp       = require('gulp');
var connect    = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var watchify   = require('watchify');
var babel      = require('babelify');

function compile() {
  var bundler = browserify('./src/index.jsx', { debug: true }).transform(babel, {presets: ["es2015", "react"]});

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./js'))
      .pipe(connect.reload());
  }

  console.log('-> bundling...');
  rebundle();
}

gulp.task('connect', () => {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('watch', () => {
  gulp.watch(['./src/*.jsx'], () => { return compile(); });
});

gulp.task('build', () => { return compile(); });

gulp.task('default', ['connect', 'build', 'watch']);

