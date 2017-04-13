const gulp = require('gulp'),
	  concatenate = require('gulp-concat'),
	  babel = require('gulp-babel'),
	  sourcemaps = require("gulp-sourcemaps");


gulp.task('default', function(){
	return gulp.src("client/app/*.js")
		.pipe(sourcemaps.init())
			.pipe(babel())
			.pipe(concatenate("app.js"))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("client/dist"));
});