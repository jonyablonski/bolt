/**
* Packages
*/

// General
var browserSync = require('browser-sync').create();

// Styles
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var gulpStylelint = require('gulp-stylelint');


/**
* Paths
*/
var paths = {
	input: './app',
	output: './dist',
	markup: {

	},
	styles: {
		input: './app/sass/**/*.{scss,sass}',
		output: './app/css'
	},
	scripts: {
			input: '',
			output: ''
	},
	images: {
			input: '',
			output: ''
	},
	fonts: {
			input: '',
			output: ''
	},
	symbols: {
			input: '',
			output: ''
	},
	icons: {
			input: '',
			output: ''
	}
};


/**
* Variables
*/

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};

var autoprefixerOptions = {
	browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};


/**
* Development Tasks
*/

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: paths.input
        }
    });
});

gulp.task('sass', function() {
	return gulp.src( paths.styles.input )
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(paths.styles.output))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('lint-css', function lintCssTask() {
  return gulp
    .src(paths.styles.output)
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('watch', function() {
	gulp.watch(paths.styles.input, ['sass']);
});


/**
* Optimization Tasks
*/


/**
* Task Runners
*/

gulp.task('default', [
	'sass',
	'lint-css',
	'watch',
	'browser-sync'
]);