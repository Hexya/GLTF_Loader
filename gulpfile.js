var gulp        = require('gulp');
var plugins     = require('gulp-load-plugins')(); // tous les plugins de package.json
var less        = require('gulp-less');
var watch       = require('gulp-watch');
var cleanCSS    = require('gulp-clean-css');
var babel       = require('gulp-babel');
var browserify  = require('browserify');
var babelify    = require('babelify');
var sourcemaps  = require('gulp-sourcemaps');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify-es').default;
var watchify    = require('watchify');

var gutil       = require('gulp-util');
var chalk       = require('chalk');
var rename      = require('gulp-rename');

var _           = require('underscore');
var livereload  = require('gulp-livereload');
var merge       = require('utils-merge');
var duration    = require('gulp-duration');
var notify      = require('gulp-notify');

var sourceLess = './less/';
var destinationLess = './css/';

gulp.task('css', function () {
    return gulp.src(sourceLess + 'main.less')
        .pipe(plugins.less())
        .pipe(plugins.csscomb())
        .pipe(plugins.cssbeautify({indent: '  '}))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(destinationLess));
})

gulp.task('minify', function () {
    return gulp.src(destinationLess + '*.css')
        .pipe(plugins.csso())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(destinationLess))
});

// Tâche "build"
gulp.task('build', ['css']);

// Tâche "prod" = Build + minify
gulp.task('prod', ['build',  'minify']);

// Tâche "watch" = je surveille *less
gulp.task('default', function () {
    gulp.watch(sourceLess + '**/*.less', ['build']);

    livereload.listen();

    var args = merge(watchify.args, { debug: false, cache: {}, packageCache: {}, fullPaths: true });

    var bundler = browserify('./js/app.js', args)
        .plugin(watchify, {ignoreWatch: []})
        .transform(babelify, {presets: ['es2015']});

    bundle(bundler);

    bundler.on('update', function() {
        bundle(bundler); // Re-run bundle on source updates
    });
});

function bundle(bundler) {
    var bundleTimer = duration('Javascript bundle time');

    bundler
        .bundle()
        .on('error', mapError) // Map error reporting
        .pipe(source('app.js')) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(rename('app.min.js')) // Rename the output file
        .pipe(gulp.dest('./dist/js')) // Set the output folder
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>',
        })) // Output the file being created
        .pipe(bundleTimer) // Output time timing of the file creation
        .pipe(livereload()); // Reload the view in the browser
}

function mapError(err) {
    if (err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
            + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
            + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
            + ': ' + chalk.blue(err.description));
    } else {
        // Browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }
}
