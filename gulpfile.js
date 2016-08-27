/**
* Packages
*/

// General
var browserSync = require('browser-sync').create();
var del = require('del');

// Markup
var nunjucksRender = require('gulp-nunjucks-render');
var htmlmin = require('gulp-htmlmin');

// Styles
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');

// Javascript
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

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
		output: './src',
		dist: './dist/'
	},
	styles: {
		input: './src/sass/**/*.{scss,sass}',
		output: './src/css/build',
		dist: './dist/css/'
	},
	javascript: {
		input: ['./src/js/polyfills/*.js', './src/js/plugins/*.js', './src/js/main.js'],
		output: './src/js/build',
		dist: './dist/js/'
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
			input: ['./src/svg/*.svg'],
			output: './src/svg/build'
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

gulp.task('javascript', function() {
	return gulp.src(paths.javascript.input)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(paths.javascript.output))
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
	gulp.watch(paths.styles.input, ['sass']);
	gulp.watch(paths.svg.input, ['svg']);
	gulp.watch(paths.javascript.input, ['javascript']);
});

gulp.task('clean', function() {
	del([paths.output, '!dist/images', '!dist/images/**/*'])
});


/**
* Optimization Tasks
*/

gulp.task('build-html', function() {
	return gulp.src('./src/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
    	.pipe(gulp.dest(paths.markup.dist))
});

gulp.task('build-css', function() {
	return gulp.src('./src/css/build/*.css')
		.pipe(cssnano())
		.pipe(gulp.dest(paths.styles.dist))
});

gulp.task('build-javascript', function() {
	return gulp.src('./src/js/build/*.js')
		.pipe(uglify())
    	.pipe(gulp.dest(paths.javascript.dist))
});


/**
* Task Runners
*/

gulp.task('default', [
	'html',
	'sass',
	'javascript',
	'svg',
	'watch',
	'browser-sync'
]);

gulp.task('build', [
	'clean',
	'html',
	'sass',
	'javascript',
	'svg',
	'build-html',
	'build-css',
	'build-javascript'
]);