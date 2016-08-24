/**
* Packages
*/

// General
var browserSync = require('browser-sync').create();

// Markup
var nunjucksRender = require('gulp-nunjucks-render');

// Styles
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var gulpStylelint = require('gulp-stylelint');

// Scripts
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


/**
* Paths
*/
var paths = {
	input: './src',
	output: './dist',
	markup: {
		input: './src/templates/**/*.+(html)',
		output: './src'
	},
	styles: {
		input: './src/sass/**/*.{scss,sass}',
		output: './src/css/build'
	},
	scripts: {
		input: ['./src/js/polyfills/*.js', './src/js/plugins/*.js', './src/js/main.js'],
    	output: './src/js/build',
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

gulp.task('html', function() {
	return gulp.src(paths.markup.input)
  .pipe(nunjucksRender({
		path: ['./src/partials']
	}))
  .pipe(gulp.dest(paths.markup.output))
  .pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('sass', function() {
	return gulp.src(paths.styles.input)
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

gulp.task('scripts', function() {
	gulp.src(paths.scripts.input)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.scripts.output))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('watch', function() {
	gulp.watch(paths.markup.input, ['html']);
	gulp.watch(paths.styles.input, ['sass', 'lint-css']);
	gulp.watch(paths.scripts.input, ['scripts']);
});


/**
* Optimization Tasks
*/


/**
* Task Runners
*/

gulp.task('default', [
	'html',
	'sass',
	'lint-css',
	'scripts',
	'watch',
	'browser-sync'
]);