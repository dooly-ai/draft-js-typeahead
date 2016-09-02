import gulp from 'gulp';
import babel from 'gulp-babel';
import runSequence from 'run-sequence';
import webpackStream from 'webpack-stream';
import del from 'del';

const buildDist = (opts) => {
  const webpackOpts = {
    debug: opts.debug,
    externals: {
      React: 'React',
      'draft-js': 'Draft'
    },
    output: {
      filename: opts.output,
      libraryTarget: 'var',
      library: 'DraftTypeahead'
    },
    plugins: [
      new webpackStream.webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          opts.debug ? 'development' : 'production'
        )
      }),
      new webpackStream.webpack.optimize.OccurenceOrderPlugin(),
      new webpackStream.webpack.optimize.DedupePlugin()
    ]
  };
  if (!opts.debug) {
    webpackOpts.plugins.push(
      new webpackStream.webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true
        }
      })
    );
  }
  return webpackStream(webpackOpts, null, (err, stats) => {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', `\n${stats.toString({ colors: true })}`);
    }
  });
};

gulp.task('clean', () => {
  return del(['dist', 'lib']);
});

gulp.task('modules', () => {
  return gulp.src('src/index.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('dist', ['modules'], () => {
  const opts = {
    debug: true,
    output: 'draft-typeahead.js'
  };
  return gulp.src('lib/index.js')
    .pipe(buildDist(opts))
    .pipe(gulp.dest('dist'));
});

gulp.task('dist:min', ['modules'], () => {
  const opts = {
    debug: false,
    output: 'draft-typeahead.min.js'
  };
  return gulp.src('lib/index.js')
    .pipe(buildDist(opts))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', (cb) => {
  runSequence('clean', 'modules', ['dist', 'dist:min'], cb);
});
