var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var packageJson = require(__dirname+'/package.json');


// src 中の *.scss を処理
gulp.task('.scss', function(){
	gulp.src("src/**/*.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest("./dist"))
	;
});

// main.js を処理
gulp.task("main.js", function() {
	gulp.src(["src/common/scripts/**/*.js"])
		.pipe(plumber())
		.pipe(concat('common/scripts/main.js'))
		.pipe(uglify())
		.pipe(gulp.dest("./dist"))
	;
});

// *.js を処理
gulp.task(".js", function() {
	gulp.src(["src/**/*.js", "!src/common/scripts/**/*"])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest("./dist"))
	;
});

// *.html を処理
gulp.task(".html", function() {
	gulp.src(["src/**/*.html", "src/**/*.htm"])
		.pipe(plumber())
		.pipe(gulp.dest("./dist"))
	;
});

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*"],[".scss", "main.js",".js",".html"]);

	var port = packageJson.baobabConfig.defaultPort;
	var svr = require('child_process').spawn('node',['./index_files/server.js','port='+port]);
	svr.stdout.on('data', function(data){
		console.log(data.toString());
	});
	svr.stderr.on('data', function(data){
		console.log(data.toString());
	});
	require('child_process').spawn('open',['http://127.0.0.1:'+port+'/']);

});

// src 中のすべての拡張子を処理(default)
gulp.task("default", [
	'.html',
	'.scss',
	'main.js',
	'.js'
]);
