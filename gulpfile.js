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

// SVG

var svgSprite = require('gulp-svg-sprite');


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
	svg: {
			input: ['./src/svg/**/*.svg', '!./src/svg/build'],
			output: './src/svg/build'
	},
	icons: {
			input: '',
			output: ''
	}
};


/**
* Configs
*/

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};

var autoprefixerOptions = {
	browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var svgOptions = {
	mode: {
		symbol: {
      	dest: './',
      	sprite: 'sprite.svg',
      	example: true
    	}
	},
	svg: {
		xmlDeclaration: false,
		doctypeDeclaration: false
	}
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

gulp.task('lint-styles', function() {
	return gulp.src(paths.styles.output)
		.pipe(gulpStylelint({
			reporters: [
				{formatter: 'string', console: true}
			]
		}));
});

gulp.task('scripts', function() {
	return gulp.src(paths.scripts.input)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest(paths.scripts.output))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('svg', function() {
	return gulp.src(paths.svg.input)
		.pipe(svgSprite(svgOptions))
		.pipe(gulp.dest(paths.svg.output))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('watch', function() {
	gulp.watch(paths.markup.input, ['html']);
	gulp.watch(paths.styles.input, ['sass', 'lint-styles']);
	gulp.watch(paths.svg.input, ['svg']);
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
	'lint-styles',
	'scripts',
	'svg',
	'watch',
	'browser-sync'
]);