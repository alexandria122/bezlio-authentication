var gulp = require('gulp'),
mergeStream = require('merge-stream'),
ts = require('gulp-typescript'),
Config = require('./gulpfile.config'),
del = require('del');

var config = new Config();

gulp.task('compile', function (cb) {
    var apiProject = ts.createProject(config.builderTsConfig);
	var api = gulp.src(config.builderTsFiles)
		.pipe(apiProject())
		.js
        .pipe(gulp.dest('src'));
});

gulp.task('clean', function (cb) {
    del(config.builderJsFiles, cb);
});