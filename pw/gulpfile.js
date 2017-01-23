var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = require('chalk');
var fs=require('fs');
var _=require('underscore');
var path = require('path');
var amdOptimize = require("amd-optimize");
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var through2 = require("through2");
var ejs = require("gulp-ejs");
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var livereload = require('gulp-livereload');
var jshint = require("gulp-jshint");

var pkg = require('./package.json');
var BUILD_TIMESTAMP = gutil.date(new Date(), "yyyymmddHHMMss");
pkg.build = BUILD_TIMESTAMP;

// ����Ĭ�Ϲ���Ŀ¼Ϊ./www
process.chdir("www");

// ��ȡenv
var argv = process.argv.slice(2);
var env = "DEVELOPMENT";
(function(){
    if((envIndex = argv.indexOf("-env"))!=-1){
        var envValue = argv[envIndex+1];
        var envs = ["DEVELOPMENT","STG1","STG2","STG3","PRODUCTION"];
        if(envValue && envs.indexOf(envValue)!=-1){
            env = envValue;
        }
    }
})();

var CONTEXT_PATH = "";
if(env != "DEVELOPMENT"){
    CONTEXT_PATH = "";
    console.log(CONTEXT_PATH);
}

gutil.log(
    'Working directory :',
    chalk.magenta(__dirname + "/www")
);

var paths = {
    src:".",
    dest:"../dist",
    output:"../output",
    templates:"../templates"
};

var handleEnv = function () {
    return through2.obj(function(file, enc, cb) {
        // console.log(file.path);
        // �滻��������
        if(file.path.indexOf("env.js")!=-1){
            file.contents = new Buffer(file.contents.toString().replace("DEVELOPMENT",env));
        }
        return cb(null, file);
    });
};

/*
 * ���Ŀ�깤��Ŀ¼
 */
gulp.task('clean', function() {
    return gulp.src(paths.dest+'/*', { read: false })
        .pipe(rimraf({ force: true }));
});

/*
 * �����ļ���Ŀ�깤��Ŀ¼
 */
gulp.task('copy', function() {
    return gulp.src([
        paths.src+"/**/*",
        // "!"+paths.src+"/data/**/*",
        "!"+paths.src+"/less/**/*",
        // "!"+paths.src+"/data",
        "!"+paths.src+"/less",
        "!"+paths.src+"/web-server.js"
    ])
        .pipe(handleEnv())
        .pipe(gulp.dest(paths.dest));
});

/*
 * ����ejsҳ��
 */
gulp.task("ejs",function(){
    return gulp.src([paths.templates + "/**/*.ejs","!" + paths.templates + "/include/**/*.ejs"])
        .pipe(ejs({
            ctx:CONTEXT_PATH,
            _build:{
                pkg:pkg,
                version: pkg.version,
                ts:BUILD_TIMESTAMP
            },
            data:{},
            delimiter:"@"
        },{
            root:__dirname+"/templates"
        }))
        .pipe(gulp.dest(".",{cwd:paths.dest}));
    //.pipe(livereload());
});

/*
 * ����less
 */
gulp.task('less', function () {
    return gulp.src(paths.src+'/less/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.src+'/css'));
    //.pipe(livereload());
});

/*
 * ����ѹ��css
 */
gulp.task('minifycss', function () {
    return gulp.src(paths.src+'/css/**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.dest+'/css'));
});

/*
 * ����ѹ��js
 */
gulp.task('uglifyjs', function () {
    return gulp.src([
        paths.dest+'/js*/**/*.js',
        paths.dest+'/libs*/require-config.js'
    ])
        .pipe(handleEnv())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify({output:{max_line_len:120}}).on("error",gutil.log))
        .pipe(gulp.dest(paths.dest));
});

/*
 * require js �Ż�
 */
gulp.task("js_optimize", function() {
    // �Ż�common
    gulp.src(paths.src+"/js/**/*.js")
        .pipe(amdOptimize("C", {
            configFile : paths.src+"/libs/require-config.js",
            exclude:["zepto","underscore","swipe","fastclick","libs/jsencrypt"]
        }))
        .pipe(handleEnv())
        // �ϲ�
        .pipe(concat("common.js"))
        .pipe(uglify().on("error",gutil.log))
        // ���
        .pipe(gulp.dest(paths.dest+"/js/common"));

    // �Ż�zepto
    gulp.src(paths.src+"/libs/**/*.js")
        .pipe(amdOptimize("zepto", {
            configFile : paths.src+"/libs/require-config.js"
        }))
        // �ϲ�
        .pipe(concat("zepto.js"))
        .pipe(uglify().on("error",gutil.log))
        // ���
        .pipe(gulp.dest(paths.dest+"/libs"));
});

/*
 * ���zip
 */
gulp.task('archive', function () {
    return gulp.src(paths.dest+'/**/*')
        .pipe(zip(pkg.name + "_v_" + pkg.version.replace(/\./g,"_") + "_" + env.toLowerCase() + "_"+BUILD_TIMESTAMP+'.zip'))
        .pipe(gulp.dest(paths.output));
});

/**
 * ����js
 */
//gulp.task('js', function () {
//  return gulp.src(paths.src+'/js/**/*.js')
//    .pipe(gulp.dest(paths.src+'/js'))
//	.pipe(livereload());
//});

/*
 * �����ļ��Ƿ�仯
 */
gulp.task('watch', function() {
    // livereload.listen();
    gulp.watch(paths.src+'/less/**/*.less', ['less']);
    // gulp.watch(paths.templates + "/**/*.ejs", ['ejs']);
    // gulp.watch(paths.src+'/js/**/*.js', ['js']);
});

/*
 * ��չ���������ʵ�Ŀ¼
 */
gulp.task('cleanFile', function() {
    return gulp.src([
        paths.dest+'/js/common/**/*',
        "!"+paths.dest+'/js/common/common.js',
        "!"+paths.dest+'/js/common/adapter.js',
        "!"+paths.dest+'/js/common/view.js',
        "!"+paths.dest+'/js/common/handle.js'
    ], { read: false })
        .pipe(rimraf({ force: true }));
});

/**
 * ���distĿ¼����Ҫ�ļ�
 */
gulp.task('cleanDist', function() {
    // paths.dest+'/data' �г������ݣ��������
    return gulp.src([paths.dest+'/less', paths.dest+'/src'])
        .pipe(rimraf({ force: true}));
});

/*
 * ��ʼ����
 */
gulp.task('build', function (callback) {
    runSequence(
        "clean",
        "copy",
        'ejs',
        'js_optimize',
        'uglifyjs',
        'less',
        'minifycss',
        'cleanFile',
        'cleanDist',
        'archive',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('RELEASE FINISHED SUCCESSFULLY');
            }
            callback(error);
        });
});


