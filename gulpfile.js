var gulp = require('gulp'), // Сообственно Gulp JS
    jade = require('gulp-jade'), // Плагин для Jade
    stylus = require('gulp-stylus'), // Плагин для Stylus
    livereload = require('gulp-livereload'), // Livereload для Gulp
    myth = require('gulp-myth'), // Плагин для Myth - http://www.myth.io/
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    gutil = require('gulp-util'),
    shell = require('gulp-shell'),
    exec = require('child_process').exec,
    plumber = require('gulp-plumber'),
    run = require('gulp-run'),
    coffee = require('gulp-coffee');

// Build JS from Coffee
gulp.task('coffee', function() {
    gulp.src('./assets/js/*.coffee')
      .pipe(plumber())
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .pipe(gulp.dest('./public/js/'))
      .pipe(livereload());
});

// Build CSS from Stylus
gulp.task('styl', function() {
  gulp.src('./assets/stylus/*.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest('./public/css/'))
    .pipe(livereload());
});

// Build HTML from Jade
gulp.task('jade', function() {
    gulp.src(['./assets/template/*.jade', '!./assets/template/_*.jade'])
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
    .pipe(gulp.dest('./public/')) // Записываем собранные файлы
    .pipe(livereload()); // даем команду на перезагрузку страницы
});

// Copy and minimize images
gulp.task('images', function() {
    gulp.src('./assets/img/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('./public/img'));
});

/*
  WATCH Tasks :
         | Watch -> Coffee
         | Watch -> Stylus
         | Watch -> Jade
*/
gulp.task('watch', function(){
  var server = livereload({ start:true });
  gulp.watch('./assets/js/*.coffee', ['coffee']);
  gulp.watch('./assets/stylus/*.styl', ['styl']);
  gulp.watch(['./assets/template/*.jade', '!./assets/template/_*.jade'], ['jade']);
  livereload();
});


// BUILD
gulp.task('build', function() {
    // css
    gulp.src('./public/css/**/*.css')
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(gulp.dest('./build/css/'));

    // jade
    gulp.src(['./assets/template/*.jade', '!./assets/template/_*.jade'])
        .pipe(jade())
        .pipe(gulp.dest('./build/'));

    // js
    gulp.src(['./public/js/**/*.js', '!./public/js/lib/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    // image
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'));

});

gulp.task('default', ['coffee', 'styl', 'jade', 'images', 'watch']);
