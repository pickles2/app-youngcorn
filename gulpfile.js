var conf = require('baobab-fw').conf();
var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var twig = require("gulp-twig");//Twigテンプレートエンジン
var browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
var rimraf = require('rimraf');// The UNIX command `rm -rf` for node.
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'.html',
	'.html.twig',
	'.css',
	'.css.scss',
	'main.js',
	'.js',
	'broccoli-client'
];


// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	gulp.src("src/**/*.css.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(rename({extname: ''}))
		.pipe(gulp.dest( conf.get().frontendDocumentRoot ))
	;
});

// src 中の *.css を処理
gulp.task('.css', function(){
	gulp.src("src/**/*.css")
		.pipe(plumber())
		.pipe(gulp.dest( conf.get().frontendDocumentRoot ))
	;
});

// main.js (frontend) を処理
gulp.task("main.js", function() {
	gulp.src(["src/common/main.js"])
		.pipe(browserify({
		}))
		.pipe(plumber())
		.pipe(concat('common/main.js'))
		// .pipe(uglify())
		.pipe(gulp.dest( conf.get().frontendDocumentRoot ))
	;
});

// *.js を処理
gulp.task(".js", function() {
	gulp.src(["src/**/*.js", "!src/common/main.js", "!src/common/apis/*"])
		.pipe(browserify({
		}))
		.pipe(plumber())
		// .pipe(uglify())
		.pipe(gulp.dest( conf.get().frontendDocumentRoot ))
	;
});

// *.html を処理
gulp.task(".html", function() {
	gulp.src(["src/**/*.html", "src/**/*.htm"])
		.pipe(plumber())
		.pipe(gulp.dest( conf.get().frontendDocumentRoot ))
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
		.pipe(gulp.dest( conf.get().frontendDocumentRoot ))
	;
});

// broccoli-client (frontend) を処理
gulp.task("broccoli-client", function() {
	gulp.task('clean', function (cb) {
	  rimraf('./dist/libs/broccoli-*', cb);
	});
	gulp.src(["node_modules/broccoli-module-bootstrap3/dist/**/*"])
  	.pipe(gulp.dest("./dist/libs/broccoli-module-bootstrap3/client/dist/"))
	;

	gulp.src(["node_modules/broccoli-html-editor/client/dist/*"])
		.pipe(gulp.dest( './dist/libs/broccoli-html-editor/client/dist/' ))
	;

	gulp.src(["node_modules/broccoli-field-image-editor/dist/**/*"])
	  .pipe(gulp.dest("./dist/libs/broccoli-field-image-editor/dist/"))
	;

	gulp.src(["node_modules/broccoli-field-table/dist/*"])
	  .pipe(gulp.dest( './dist/libs/broccoli-field-table/dist/' ))
	;

	gulp.src(["node_modules/broccoli-field-psd/dist/*"])
	  .pipe(gulp.dest( './dist/libs/broccoli-field-psd/dist/' ))
	;
});

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*"], _tasks);

	var port = packageJson.baobabConfig.defaultPort;
	var svrCtrl = require('baobab-fw').createSvrCtrl();
	svrCtrl.boot(function(){
		require('child_process').spawn('open',[svrCtrl.getUrl()]);
	});

});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
