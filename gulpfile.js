/////////////////////
// MODULES IMPORT //
///////////////////

// Generic
var browserSync = require('browser-sync');
var requireDir = require('require-dir');


// Gulp
var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var cmq = require('gulp-combine-media-queries');
var concat = require('gulp-concat');
var fileinclude	= require('gulp-file-include');
var markdown = require('gulp-markdown');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify');
var order = require('gulp-order');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var watch = require('gulp-watch');


    

////////////////////////
// PROJECT VARIABLES //
//////////////////////

// Paths
var path = {

	// global directories

	publicDir: './',

	assetsDir: './assets',

	// task-based directories
	htmlSrc: './_html/**/**/*.html',
	htmlDir: './',

	markdownSrc: './_md/**/**/**.md',
	markdownDir: './_html/texts',

	sassSrc: './_sass/**/**/**/*.{sass,scss}',
	sassDir: './assets/css',

	jsSrc: './_js/**/**/**.js',
	jsDir: './assets/js',

	css: './assets/css/**/**.css'

};



//////////////////////////////
// GULP - FUNCTIONAL TASKS //
////////////////////////////

// 'browser-sync'
//
// 	- spins up a local server

gulp.task('browser-sync', function() {

	browserSync.init({
		server: {
			baseDir: path.publicDir,
			open: 'local',
			host: 'localhost'
		}
	});

});



// 'sass'
// 
//	- compiles SASS into CSS
//	- creates SASS sourcemaps for easier debugging
// 	- adds vendor prefixes
//	- combines indetical media queries
//	- minifies the CSS

gulp.task('sass', function () {

	return gulp.src(path.sassSrc)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
        }))
        .pipe(cmq())
		.pipe(minifyCSS({keepSpecialComments: '0'}))
		.pipe(gulp.dest(path.sassDir))
		.pipe(browserSync.reload({stream:true}))

});


// 'markdown'
//
//	- compiles Markdown into HTML partials
gulp.task('markdown', function() {

	return gulp.src(path.markdownSrc)
		.pipe(plumber())
		.pipe(markdown())
		.pipe(gulp.dest(path.markdownDir))
		.pipe(browserSync.reload({stream:true}));

});



// 'html'
//
//	- includes all the HTML files and exports them to root
//	- concats JS files based on building blocks in HTML

gulp.task('html', function() {
	
	return gulp.src(path.htmlSrc)
		.pipe(plumber())
  		.pipe(fileinclude())
		.pipe(gulp.dest(path.htmlDir))
  		.pipe(browserSync.reload({stream:true}));

});


// 'js'
//
//	- concat .js files in specific order
//	- order is defined in the Gulpfile.js (sorry..)

gulp.task('js', function(){

	return gulp.src(path.jsSrc)
		.pipe(order([
			"vendor/modernizr-2.8.3.min.js",
			"vendor/classie.js",
			"vendor/smart-underline.js",
			"main.js"
		]))
		.pipe(concat("main.js"))
		.pipe(uglify())
		.pipe(gulp.dest(path.jsDir))
  		.pipe(browserSync.reload({stream:true}));

});



//////////////////////////////
// GULP - GLOBAL TASKS //
////////////////////////////


// 'watch'
//
//	- watches for changes in files
//	- runs appropriate task when changes are detected
//	- reloads browserSync

gulp.task('watch', ['browser-sync'], function() {

	watch(path.sassSrc, function() { gulp.start('sass'); });
	watch(path.markdownSrc, function() { gulp.start('markdown'); });
	watch(path.jsSrc, function() { gulp.start('js'); });
	watch(path.htmlSrc, function() { gulp.start('html'); });

});


// 'default'
//
//	- default set of tasks that are triggered after running 'gulp'

gulp.task('default', ['sass', 'markdown', 'js', 'html', 'watch']);
