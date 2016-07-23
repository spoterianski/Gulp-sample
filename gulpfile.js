var lr = require('tiny-lr'), // Минивебсервер для livereload
    gulp = require('gulp'), // Сообственно Gulp JS
    jade = require('gulp-jade'), // Плагин для Jade
    stylus = require('gulp-stylus'), // Плагин для Stylus
    livereload = require('gulp-livereload'), // Livereload для Gulp
    myth = require('gulp-myth'), // Плагин для Myth - http://www.myth.io/
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    connect = require('connect'), // Webserver
    server = lr(),
    shell = require('gulp-shell');

// Stylus build
gulp.task('stylus', function() {
    gulp.src('./assets/stylus/screen.styl')
        .pipe(stylus({
            use: ['nib']
        })) // собираем stylus
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(myth()) // добавляем префиксы - http://www.myth.io/
    .pipe(gulp.dest('./public/css/')) // записываем css
    .pipe(livereload(server)); // даем команду на перезагрузку css
});

// Build HTML from Jade
gulp.task('jade', function() {
    gulp.src(['./assets/template/*.jade', '!./assets/template/_*.jade'])
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(gulp.dest('./public/')) // Записываем собранные файлы
    .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

// Build JS
gulp.task('js', function() {
    gulp.src(['./assets/js/**/*.js', '!./assets/js/vendor/**/*.js'])
        .pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        .pipe(gulp.dest('./public/js'))
        .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

// Copy and minimize images
gulp.task('images', function() {
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'))
});

// Locale server for dev
gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('./public'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

// WATCH
gulp.task('watch', function() {
    // Предварительная сборка проекта
    gulp.run('stylus');
    gulp.run('jade');
    gulp.run('images');
    gulp.run('js');

    // Connect Livereload
    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('assets/stylus/**/*.styl', function() {
            gulp.run('stylus');
        });
        gulp.watch('assets/template/**/*.jade', function() {
            gulp.run('jade');
        });
        gulp.watch('assets/img/**/*', function() {
            gulp.run('images');
        });
        gulp.watch('assets/js/**/*', function() {
            gulp.run('js');
        });
    });
    gulp.run('http-server');
});

// BUILD
gulp.task('build', function() {
    // css
    shell.task(['stylus assets/stylus --out build/css']);

    // jade
    gulp.src(['./assets/template/*.jade', '!./assets/template/_*.jade'])
        .pipe(jade())
        .pipe(gulp.dest('./build/'))

    // js
    gulp.src(['./assets/js/**/*.js', '!./assets/js/vendor/**/*.js'])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    // image
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))

});
