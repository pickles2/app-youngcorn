var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var twig = require("gulp-twig");//Twigテンプレートエンジン
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'.html',
	'.html.twig',
	'.css',
	'.css.scss',
	'main.js',
	'.js'
];


// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	gulp.src("src/**/*.css.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(rename({extname: ''}))
		.pipe(gulp.dest("./dist"))
	;
});

// src 中の *.css を処理
gulp.task('.css', function(){
	gulp.src("src/**/*.css")
		.pipe(plumber())
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

// *.html.twig を処理
gulp.task(".html.twig", function() {
	gulp.src(["src/**/*.html.twig"])
		.pipe(plumber())
		.pipe(twig({
			data: {packageJson: packageJson}
		}))
		.pipe(rename({extname: ''}))
		.pipe(gulp.dest("./dist"))
	;
});

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*"], _tasks);

	var port = packageJson.baobabConfig.defaultPort;
	var svrCtrl = require(__dirname+'/index_files/_svrCtrl.js');
	svrCtrl.boot(function(){
		require('child_process').spawn('open',[svrCtrl.getUrl()]);
	});

});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
