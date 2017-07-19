//************************************************
// NPM DEPENDENCIES
//************************************************
const chalk = require('chalk');

//************************************************
// LOAD GULP DEPENDENCIES
//************************************************
const gulp = require('gulp');
const gulp_babel = require('gulp-babel');
const gulp_clean_css = require('gulp-clean-css');
const gulp_htmlmin = require('gulp-htmlmin');
const gulp_imagemin = require('gulp-imagemin');
const gulp_less = require('gulp-less');
const gulp_sourcemaps = require('gulp-sourcemaps');
const gulp_uglify = require('gulp-uglify');
const gulp_inject = require('gulp-inject');

//************************************************
// CONSTANTS
//************************************************

// BASE DIRECTORIES
const SRC_DIR = 'src';
const DIST_DIR = 'dist';

// FILE TYPE SPECIFIC DIRECTORIES
const JS_SRC_DIR = `${SRC_DIR}/js`;
const JS_DIST_DIR = `${DIST_DIR}/js`;
const LESS_DIR = `${SRC_DIR}/less`;
const CSS_DIR = `${DIST_DIR}/css`;
const IMG_DIST_DIR = `${DIST_DIR}`;
const IMG_SRC_PATTERN = [`${SRC_DIR}/**/*.{ico,png,jpg}`, `!${SRC_DIR}/img/resources/**/*`];
const ASSET_PATTERN = `${SRC_DIR}/*.{xml,json}`;

// MAIN FILES
const LESS_FILES = `${LESS_DIR}/**/*.less`;
const LESS_MAIN_FILE = `${LESS_DIR}/main.less`;
const LESS_INLINE_FILE = `${LESS_DIR}/inject.less`;
const JS_MAIN_FILE = `${JS_SRC_DIR}/main.js`;
const HTML_MAIN_SRC_FILE = `${SRC_DIR}/index.html`;

// FILES TO INJECT
const INJECT_CSS =`${CSS_DIR}/inject.css`;
const INJECT_LOGO = `${SRC_DIR}/img/resources/logo.svg`;

//************************************************
// INITIALIZATION
//************************************************
function init() {
	// Show welcome banner
	console.log(
		chalk.green(
			'************************************************\n' +
			'*              schwarzdavid.rocks              *\n' +
			'************************************************\n'
		)
	);
}
init();

//************************************************
// TASK HANDLER FOR JS
//************************************************
function buildJs() {
	return gulp.src(JS_MAIN_FILE)
		.pipe(gulp_sourcemaps.init())
		.pipe(gulp_babel({presets: ['es2015']}))
		.pipe(gulp_uglify())
		.pipe(gulp_sourcemaps.write('./'))
		.pipe(gulp.dest(JS_DIST_DIR));
}

//************************************************
// TASK HANDLER FOR LESS
//************************************************
function buildLess() {
	return gulp.src([LESS_MAIN_FILE, LESS_INLINE_FILE])
		.pipe(gulp_sourcemaps.init())
		.pipe(gulp_less())
		.pipe(gulp_clean_css())
		.pipe(gulp_sourcemaps.write('./'))
		.pipe(gulp.dest(CSS_DIR));
}

//************************************************
// TASK HANDLER FOR OTHER FILES
//************************************************
function buildImg() {
	return gulp.src(IMG_SRC_PATTERN)
		.pipe(gulp_imagemin())
		.pipe(gulp.dest(IMG_DIST_DIR));
}

//************************************************
// TASK HANDLER FOR HTML
//************************************************
function buildHtml() {
	return gulp.src(HTML_MAIN_SRC_FILE)
		.pipe(gulp_inject(gulp.src(INJECT_CSS), {
			starttag: '<!-- inject:style -->',
			transform: function (path, file) {
				return '<style>' + file.contents.toString('utf8') + '</style>';
			}
		}))
		.pipe(gulp_inject(gulp.src(INJECT_LOGO), {
			starttag: '<!-- inject:logo -->',
			transform: function (path, file) {
				return file.contents.toString('utf8');
			}
		}))
		.pipe(gulp_htmlmin({collapseWhitespace: true, minifyJS: true, removeComments: true}))
		.pipe(gulp.dest(DIST_DIR));
}

//************************************************
// TASK HANDLER FOR ASSETS
//************************************************
function buildAssets() {
	return gulp.src(ASSET_PATTERN)
		.pipe(gulp.dest(DIST_DIR));
}

//************************************************
// WATCHER
//************************************************
function watcherChangeEvent(e) {
	console.log(`File ${e.path} was ${e.type}, running tasks...`);
}

function watch() {
	let watcher_js;
	watcher_js = gulp.watch(JS_MAIN_FILE, ['build:js']);
	watcher_js.on('change', watcherChangeEvent);

	let watcher_less;
	watcher_less = gulp.watch(LESS_FILES, ['build:less']);
	watcher_less.on('change', watcherChangeEvent);

	let watcher_html;
	watcher_html = gulp.watch(HTML_MAIN_SRC_FILE, ['build:html']);
	watcher_html.on('change', watcherChangeEvent);
}

//************************************************
// GULP TASKS
//************************************************
gulp.task('build', ['build:js', 'build:less', 'build:html', 'build:img', 'build:assets']);
gulp.task('build:js', buildJs);
gulp.task('build:less', buildLess);
gulp.task('build:html', ['build:less'], buildHtml);
gulp.task('build:img', buildImg);
gulp.task('build:assets', buildAssets);

gulp.task('watch', ['build'], watch);
gulp.task('default', ['build']);