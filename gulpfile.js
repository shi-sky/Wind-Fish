var gulp = require('gulp');
var webpack = require('gulp-webpack');
var loader = require('vue-loader');

var named = require('vinyl-named');

var app = "src";
var appList = ['main', 'sub1', 'sub2'];


gulp.task('bundle', function() {
  return gulp.src(mapFiles(appList, 'js'))
    .pipe(named())
    .pipe(webpack(getConfig()))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
  return gulp.src(mapFiles(appList, 'js'))
    .pipe(named())
    .pipe(webpack(getConfig({watch: true})))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', function() {


});
/**
 * @private
 */
function getConfig(opt) {
  var config = {
    module: {
      loaders: [
        { test: /\.vue$/, loader: 'vue'}
      ]
    }
  };
  if (!opt) {
    return config;
  }
  for (var i in opt) {
    config[i] = opt;
  }
  return config;
}

/**
 * @private
 */
function mapFiles(list, extname) {
  return list.map(function (app) {return 'src/' + app + '.' + extname});
}
