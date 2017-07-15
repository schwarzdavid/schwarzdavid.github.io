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
const gulp_less = require('gulp-less');
const gulp_sourcemaps = require('gulp-sourcemaps');
const gulp_uglify = require('gulp-uglify');
const gulp_rename = require('gulp-rename');
const gulp_inject = require('gulp-inject');

//************************************************
// CONSTANTS
//************************************************
const JS_DIR = 'js';
const LESS_DIR = 'less';
const CSS_DIR = 'css';

const LESS_MAIN_FILE = `${LESS_DIR}/main.less`;
const LESS_INLINE_FILE = `${LESS_DIR}/inject.less`;
const JS_MAIN_FILE = `${JS_DIR}/main.js`;
const HTML_MAIN_FILE = 'index.html';

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
		.pipe(gulp_babel({ presets:['es2015']}))
		.pipe(gulp_uglify())
		.pipe(gulp_rename({suffix: '.min'}))
		.pipe(gulp_sourcemaps.write('./'))
		.pipe(gulp.dest(JS_DIR));
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

function buildInlineLess() {
	return gulp.src(HTML_MAIN_FILE)
		.pipe(gulp_inject(gulp.src('css/inject.css'), {
			starttag: '<!-- inject:style -->',
			empty: true,
			transform: function (path, file) {
				return file.contents.toString('utf8');
			}
		}))
		.pipe(gulp.dest('./'));
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
	watcher_less = gulp.watch(LESS_MAIN_FILE, ['build:less']);
	watcher_less.on('change', watcherChangeEvent);

	let watcher_inline;
	watcher_inline = gulp.watch(LESS_INLINE_FILE, ['build:less-inline']);
	watcher_inline.on('change', watcherChangeEvent);
}

//************************************************
// GULP TASKS
//************************************************
gulp.task('build', ['build:js', 'build:less', 'build:less-inline']);
gulp.task('build:js', buildJs);
gulp.task('build:less', buildLess);
gulp.task('build:less-inline', ['build:less'], buildInlineLess);

gulp.task('watch', ['build'], watch);
gulp.task('default', ['build']);