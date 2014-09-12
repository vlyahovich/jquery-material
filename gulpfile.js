var gulp = require('gulp');
var clean = require('gulp-clean');
var bowerFiles = require('gulp-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var declare = require('gulp-declare');

// Config
var paths = {
	index: './src/index.html',
	templates: './src',
	js: './src/js',
	css: './src/css',
	assets: './src/img/**/*.*',
	build: './build',
	spec: './'
};

// Tasks
var cssTask = function () {
	return gulp.src(paths.css + '/**/*.css')
			.pipe(concat('app.css'));
};
var bowerTask = function () {
	return bowerFiles()
			.pipe(concat('vendor.js'));
};
var jsTask = function () {
	return gulp.src(paths.js + '/**/*.js')
			.pipe(concat('app.js'));
};
var templatesTask = function () {
	return gulp.src(paths.templates+'/**/*.hbs')
			.pipe(handlebars())
			.pipe(defineModule('plain'))
			.pipe(declare({
				namespace: 'hbsTemplates'
			}))
			.pipe(concat('templates.js'));
};


// Gulp tasks
gulp.task('clean', function () {
	return gulp.src(paths.build + '/**/*.*', {read: false}).pipe(clean());
});

gulp.task('assets', ['clean'], function () {
	return gulp.src(paths.assets, { base: './src' }).pipe(gulp.dest(paths.build));
});

gulp.task('js', ['clean'], function () {
	return jsTask().pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('templates', ['clean'], function () {
	return templatesTask().pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('css', ['clean'], function () {
	return cssTask().pipe(gulp.dest(paths.build + '/css'));
});

gulp.task('bower', ['clean'], function () {
	return bowerTask().pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('build', ['js', 'templates', 'css', 'bower', 'assets'], function () {
	return gulp.src(paths.index).pipe(gulp.dest(paths.build))
			.pipe(connect.reload());
});

gulp.task('js-prod', ['clean'], function () {
	return jsTask().pipe(uglify())
			.pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('templates-prod', ['clean'], function () {
	return templatesTask().pipe(uglify())
			.pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('css-prod', ['clean'], function () {
	return cssTask().pipe(minifyCss())
			.pipe(gulp.dest(paths.build + '/css'));
});

gulp.task('bower-prod', ['clean'], function () {
	return bowerTask().pipe(uglify())
			.pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('build-prod', ['js-prod', 'templates-prod', 'css-prod', 'bower-prod', 'assets'], function () {
	return gulp.src(paths.index).pipe(gulp.dest(paths.build));
});

gulp.task('watch', ['build'], function () {
	connect.server({
		root: paths.build,
		livereload: true
	});

	gulp.watch('./src/**/*.*', ['build']);
});

gulp.task('spec', function () {
	connect.server({
		root: paths.spec,
		port: 5321
	});
});

gulp.task('default', ['build']);