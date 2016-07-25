var gulp = require('gulp'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    myth = require('gulp-myth'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    shell = require('gulp-shell'),
    exec = require('child_process').exec,
    plumber = require('gulp-plumber'),
    run = require('gulp-run'),
    coffee = require('gulp-coffee');

// Compile Coffee - to - JS
gulp.task('coffee', function() {
  gulp.src('./assets/js/*.coffee')
    .pipe(plumber())
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./public/js/'))
    .pipe(livereload());
});

// Compile Stylus - to - CSS
gulp.task('styl', function() {
  gulp.src('./assets/stylus/*.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest('./public/css/'))
    .pipe(livereload());
});

// Compile Jade - to - html
gulp.task('jade', function() {
  gulp.src(['./assets/template/*.jade', '!./assets/template/_*.jade'])
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(livereload());
});

// Copy and minimize images
gulp.task('images', function() {
  gulp.src('./assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/img'));
});

/*
  WATCH Tasks :
       | Watch -> Coffee :: assetss/js/*.coffeee
       | Watch -> Stylus :: assets/stylus/*.styl
       | Watch -> Jade :: assets/template/*.jade
*/
gulp.task('watch', function(){
  var server = livereload({ start:true });
  gulp.watch('./assets/js/*.coffee', ['coffee']);
  gulp.watch('./assets/stylus/*.styl', ['styl']);
  gulp.watch(['./assets/template/*.jade', '!./assets/template/_*.jade'], ['jade']);
  livereload();
});

// DEFAULT Task --- running on : gulp :: command
gulp.task('default', ['coffee', 'styl', 'jade', 'images', 'watch']);

// BUILD Task --- running on : gulp build :: command
gulp.task('build', function() {
  // js
  gulp.src(['./public/js/**/*.js', '!./public/js/lib/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));

  // css
  gulp.src('./public/css/**/*.css')
    .pipe(csso({
        restructure: false,
        sourceMap: true,
        debug: true
    }))
    .pipe(gulp.dest('./build/css/'));

  // html
  gulp.src(['./assets/template/*.jade', '!./assets/template/_*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('./build/'));

  // image
  gulp.src('./assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img'))
    .pipe(gulp.dest('./public/img'));
});
