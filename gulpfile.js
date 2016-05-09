'use strict';

let path = require('path');
let gulp = require('gulp');

let htmlmin = require('gulp-htmlmin');

let less = require('gulp-less'),
    cleanCss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer');

let babel = require('gulp-babel'),
    uglify = require('gulp-uglify');

let livereload = require('gulp-livereload'),
    liveServer = require('gulp-live-server');

let app = function (inPath) {
    return path.resolve('./frontend', inPath);
}, dist = function (inPath) {
    return path.resolve('./public', inPath);
}, bower = function (inPath) {
    return path.resolve('./bower_components', inPath);
}, nodeModule = inPath => path.resolve('./node_modules', inPath);

gulp.task('html', function () {
    gulp.src(app('**/*.html'))
        .pipe(htmlmin({
            removeComments: true,               // 移除注释
            collapseWhitespace: true,           // 移除空白
            conservativeCollapse: true,         // 所有空白保留一个空格
            useShortDoctype: true,              // 缩短 Doctype
            removeScriptTypeAttributes: true,   // 移除 script 标签的 type 属性
            removeStyleLinkTypeAttributes: true,// 移除 style 标签和 link 标签的 type 属性
            removeIgnored: true,                // 移除 <% %> <? ?> 标签
            minifyJS: true,                     // 压缩 js
            minifyCSS: true,                    // 压缩 css
            minifyURLs: true,                   // 压缩 url
        }))
        .pipe(gulp.dest(dist('')))
        .pipe(livereload());
});

gulp.task('font', () => {
    gulp.src(nodeModule('bootstrap/dist/fonts/**'))
        .pipe(gulp.dest(dist('fonts')))
        .pipe(livereload());
});

gulp.task('less', function () {
    gulp.src(app('styles/*.less'))
        .pipe(less())
        .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 8'] }))
        .pipe(cleanCss(/*{compatibility: 'ie8'}*/))
        .pipe(gulp.dest(dist('styles')))
        .pipe(livereload());
});

gulp.task('css', function () {
    gulp.src(nodeModule('bootstrap/dist/css/bootstrap.css'))
        .pipe(gulp.dest(dist('styles')))
        .pipe(livereload());
});

gulp.task('images', () => {
    gulp.src(app('images/**/*.*'))
        .pipe(gulp.dest(dist('images')));
});

// gulp.task('sass', function () {
//     gulp.src(app('styles/**/*.scss'))
//         .pipe(sass().on('error', sass.logError))
//         .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 8'] }))
//         .pipe(minifyCss(/*{compatibility: 'ie8'}*/))
//         .pipe(gulp.dest(dist('styles')))
//         .pipe(livereload());
// });

gulp.task('react', function () {
    gulp.src(app('scripts/**/*.jsx'))
        .pipe(babel({ presets: ['es2015', 'react'] }))
        // .pipe(uglify())
        .pipe(gulp.dest(dist('scripts')))
        .pipe(livereload());
});

gulp.task('javascript', function () {
    gulp.src([
        nodeModule('bootstrap/dist/js/bootstrap.js'),
        nodeModule('jquery/dist/jquery.js'),
        nodeModule('react/dist/react.js'),
        nodeModule('react-dom/dist/react-dom.js'),
        nodeModule('react-router/umd/ReactRouter.js'),
        nodeModule('redux/dist/redux.js'),
        nodeModule('react-redux/dist/react-redux.js'),
        // nodeModule('react-bootstrap/react-bootstrap.js'),
        nodeModule('requirejs/require.js'),
        nodeModule('immutable/dist/immutable.js'),
    ])
        // .pipe(uglify())
        .pipe(gulp.dest(dist('scripts/lib')))
        .pipe(livereload());

    gulp.src(nodeModule('global-event/dist/global-event.js'))
        .pipe(gulp.dest(dist('scripts/lib')))
        .pipe(livereload());

    gulp.src(app('scripts/**/*.js'))
        .pipe(babel({ presets: ['es2015'] }))
        //.pipe(uglify())
        .pipe(gulp.dest(dist('scripts')))
        .pipe(livereload());
});

gulp.task('watch', ['html', 'react', 'javascript', 'font', 'css', 'less', 'images'], function () {
    livereload.listen();

    gulp.watch(app('**/*.html'), ['html']);
    gulp.watch(app('styles/**/*.less'), ['less']);
    gulp.watch(app('scripts/**/*.jsx'), ['react']);
    gulp.watch(app('scripts/**/*.js'), ['javascript']);

    //let server = liveServer.static('dist', 3000);
    //server.start();
});

gulp.task('dist', ['react', 'javascript', 'font', 'css', 'less', 'images']);