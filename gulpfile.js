/**
* Packages
*/

// General
var notify = require("gulp-notify");
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
var critical = require('critical').stream;

// Javascript
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

// SVG
var svgSprite = require('gulp-svg-sprite');

// Images
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');


/**
* Paths
*/
var paths = {
	input: './src',
	output: './dist',
	markup: {
		input: './src/templates/**/*.+(html)',
		output: './src/',
		dist: './dist/'
	},
	styles: {
		input: './src/sass/**/*.{scss,sass}',
		output: './src/css/',
		dist: './dist/css/'
	},
	javascript: {
		input: ['./src/js/polyfills/*.js', './src/js/plugins/*.js', './src/js/main/main.js'],
		output: './src/js/',
		dist: './dist/js/'
	},
	images: {
		input: './src/images/**/*.+(png|jpg|jpeg|gif|svg)',
		dist: './dist/images/'
	},
	fonts: {
		input: '',
		output: ''
	},
	svg: {
		input: ['./src/svg/*.svg'],
		output: './src/',
		dist: './dist/'
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
		inline: true,
		symbol: {
      	dest: './',
      	sprite: 'sprite.svg',
      	example: false
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
		.pipe(notify({ message: 'HTML task complete' }))
});

gulp.task('sass', function() {
	return gulp.src(paths.styles.input)
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions)).on('error', notify.onError(function (error) {
   		return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error;
		}))
		.pipe(autoprefixer())
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(paths.styles.output))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(notify({ message: 'Sass task complete' }))
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
		.pipe(notify({ message: 'Javascript task complete' }))
});

gulp.task('svg', function() {
	return gulp.src(paths.svg.input)
		.pipe(svgSprite(svgOptions))
		.pipe(gulp.dest(paths.svg.output))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(notify({ message: 'SVG task complete' }))
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

gulp.task('optimize-html', function() {
	return gulp.src(paths.markup.output + '*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
    	.pipe(gulp.dest(paths.markup.dist))
    	.pipe(notify({ message: 'HTML build task complete' }))
});

gulp.task('optimize-css', function() {
	return gulp.src(paths.styles.output + '*.css')
		.pipe(cssnano())
		.pipe(gulp.dest(paths.styles.dist))
		.pipe(notify({ message: 'CSS build task complete' }))
});

gulp.task('optimize-javascript', function() {
	return gulp.src([paths.javascript.output + '*.js'])
		.pipe(uglify())
    	.pipe(gulp.dest(paths.javascript.dist))
    	.pipe(notify({ message: 'Javascript build task complete' }))
});

gulp.task('build-svg', function () {
	return gulp.src(paths.svg.output + 'sprite.svg')
		.pipe(gulp.dest(paths.svg.dist))
		.pipe(notify({ message: 'SVG build task complete' }))
});

gulp.task('optimize-images', function(){
  return gulp.src(paths.images.input)
  .pipe(cache(imagemin({
		interlaced: true
	})))
  .pipe(gulp.dest(paths.images.dist))
  .pipe(notify({ message: 'Images have been optimized' }))
});


/**
* Performance Tasks
*/

gulp.task('critical', function () {
	return gulp.src('./dist/*.html')
		.pipe(critical({
			base: './dist',
			inline: true,
			minify: true,
			width: 1366,
			height: 800
		}))
		.pipe(gulp.dest('./dist/'))
		.pipe(notify({ message: 'Critical CSS has been generated' }))
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
	'optimize-html',
	'optimize-css',
	'optimize-javascript',
	'build-svg',
	'optimize-images'
]);