'use strict';

var path = require('path');
var gulp = require('gulp');

var htmlmin = require('gulp-htmlmin');

var sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer');

var react = require('gulp-react'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify');

var app = function (inPath) {
    return path.resolve('./frontend', inPath);
}, dist = function (inPath) {
    return path.resolve('./public', inPath);
}, bower = function (inPath) {
    return path.resolve('./bower_components', inPath);
};

gulp.task('html', function () {
    gulp.src(app('**/*.html'))
        .pipe(htmlmin({
            removeComments: true,               // ÒÆ³ý×¢ÊÍ
            collapseWhitespace: true,           // ÒÆ³ý¿Õ°×
            conservativeCollapse: true,         // ËùÓÐ¿Õ°×±£ÁôÒ»¸ö¿Õ¸ñ
            useShortDoctype: true,              // Ëõ¶Ì Doctype
            removeScriptTypeAttributes: true,   // ÒÆ³ý script ±êÇ©µÄ type ÊôÐÔ
            removeStyleLinkTypeAttributes: true,// ÒÆ³ý style ±êÇ©ºÍ link ±êÇ©µÄ type ÊôÐÔ
            removeIgnored: true,                // ÒÆ³ý <% %> <? ?> ±êÇ©
            minifyJS: true,                     // Ñ¹Ëõ js
            minifyCSS: true,                    // Ñ¹Ëõ css
            minifyURLs: true,                   // Ñ¹Ëõ url
        }))
        .pipe(gulp.dest(dist('')));
});

gulp.task('sass', function () {
    gulp.src(app('styles/**/*.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 8'] }))
        .pipe(minifyCss(/*{compatibility: 'ie8'}*/))
        .pipe(gulp.dest(dist('styles')));
});

gulp.task('react', function () {
    gulp.src(app('scripts/**/*.jsx'))
        .pipe(react({ harmony: true }))
        .pipe(uglify())
        .pipe(gulp.dest(dist('scripts')));
});

gulp.task('javascript', function () {
    gulp.src([
        bower('bootstrap-sass/assets/javascripts/bootstrap.js'),
        bower('jquery/dist/jquery.js'),
        bower('react/react.js'),
        bower('react-router/build/umd/ReactRouter.js'),
        bower('react-bootstrap/react-bootstrap.js'),
        bower('requirejs/require.js')
    ])
        .pipe(uglify())
        .pipe(gulp.dest(dist('scripts/lib')));
    gulp.src(app('scripts/**/*.js'))
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(uglify())
        .pipe(gulp.dest(dist('scripts')));
});

gulp.task('watch', function () {
    gulp.watch(app('**/*.html'), ['html']);
    gulp.watch(app('styles/**/*.scss'), ['sass']);
    gulp.watch(app('scripts/**/*.jsx'), ['react']);
    gulp.watch(app('scripts/**/*.js'), ['javascript']);
});