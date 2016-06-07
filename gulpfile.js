var gulp = require('gulp'),
    emailBuilder = require('gulp-email-builder');

gulp.task('build', function () {
    return gulp.src('./src/*.html')
        .pipe(emailBuilder())
        .pipe(gulp.dest('./build/'))
});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/**', ['build']);
});