const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');
const revManifest = require('gulp-revmanifest');


// empty the assets when rebuilding the project 
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});


gulp.task('css', function(done){
    console.log('minifiying css');

    gulp.src('./assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'));

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    console.log('done css');
    done();
});


gulp.task('js', function(done){
    console.log('minifiying js');

    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    console.log('done js');
    done();
});


gulp.task('images', function(done){
    console.log('compressing images');
    gulp.src('./assets/**/*.+(png|jpg|gif||svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
})





gulp.task('test', function(done){
    console.log('Starting task');
    gulp.src('./assets/js/*.js')
    .pipe(rev())
    .pipe(gulp.dest('./testing/js'))
    .pipe(revManifest())
    .pipe(gulp.dest('./testing'))
    done();
});


gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});

// gulp.task('watch', function() {
//     gulp.watch('assets/js/**/*.js', ['build']);
//     // gulp.watch('assets/css/**/*.css', ['build']);
// });