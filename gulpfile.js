'use strict';

var fs = require("fs"),
    gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    emailBuilder = require('gulp-email-builder'),
    postmark = require('postmark');

var postmarkConfig = require('./postmark.json'),
    postmarkClient = new postmark.Client(postmarkConfig.token);

function postmarkEditTemplate (template) {
    return new Promise((resolve, reject) => {
        postmarkClient.editTemplate(template.id, {
            "Name": template.name,
            "Subject": template.subject,
            "TextBody": "",
            "HtmlBody": String(fs.readFileSync(template.src))
        }, (error, success) => {
            if (error) {
                reject(error);
            } else {
                gulpUtil.log('Success:', template.name);
                resolve(success);
            }
        });
    });
}

gulp.task('build', function () {
    return gulp.src('./src/*.html')
        .pipe(emailBuilder())
        .pipe(gulp.dest('./build/'))
});

gulp.task('production', ['build'], callback => {
    Promise.all(postmarkConfig.templates.map(template => {
        return postmarkEditTemplate(template);
    })).then(() => callback());
});

gulp.task('watch', ['build'], () => {
    gulp.watch('./src/**', ['build']);
});