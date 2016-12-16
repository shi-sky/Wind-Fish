var gulp = require('gulp');
var webpack = require('gulp-webpack');
var loader = require('vue-loader');

var named = require('vinyl-named');

var app = "src";
var appList = ['main', 'sub1', 'sub2'];
gulp.task('default', function() {

  return gulp.src(mapFiles(appList, 'js'))
    .pipe(named())
    .pipe(webpack({
      module: {
        loaders: [
          { test: /\.vue$/, loader: 'vue'}
        ]
      },
       watch: true
    }))
    .pipe(gulp.dest('dist/'));
});
/**
 * @private
 */
function mapFiles(list, extname) {
  return list.map(function (app) {return 'src/' + app + '.' + extname});
}
