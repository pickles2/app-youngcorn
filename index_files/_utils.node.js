/**
 * node utilities
 */
(function(exports){
	var _fs = require('fs');
	var _path = require('path'); // see: http://nodejs.jp/nodejs.org_ja/docs/v0.4/api/path.html
	var _crypto = require('crypto');
	var _pathCurrentDir = process.cwd();
	var DIRECTORY_SEPARATOR = '/';
	var _platform = (function(){
		var platform = 'unknown';
		if(process.env.LOCALAPPDATA)return 'win';
		if(process.env.HOME)return 'mac';
		return platform;
	})();

	/**
	 * システムコマンドを実行する(exec)
	 */
	exports.exec = function(cmd, callback, opts){
		opts = opts||{};
		if( opts.cd ){
			process.chdir( opts.cd );
		}
		var proc = require('child_process').exec(cmd, callback);
		if( opts.cd ){
			process.chdir( _pathCurrentDir );
		}
		return proc;
	}

	/**
	 * システムコマンドを実行する(spawn)
	 */
	exports.spawn = function(cmds, opts){
		opts = opts||{};
		if( opts.cd ){
			process.chdir( opts.cd );
		}

		var proc = require('child_process').spawn(cmds.slice(0,1)[0], cmds.slice(1));
		if( opts.success ){ proc.stdout.on('data', opts.success); }
		if( opts.error ){ proc.stderr.on('data', opts.error); }
		if( opts.complete ){ proc.on('close', opts.complete); }

		if( opts.cd ){
			process.chdir( _pathCurrentDir );
		}
		return proc;
	}

	/**
	 * 直列処理
	 */
	exports.iterate = function(ary, fnc, fncComplete){
		new (function( ary, fnc, fncComplete ){
			this.idx = -1;
			this.idxs = [];
			for( var i in ary ){
				this.idxs.push(i);
			}
			this.ary = ary||[];
			this.fnc = fnc||function(){};
			this.fncComplete = fncComplete||function(){};

			this.next = function(){
				if( this.idx+1 >= this.idxs.length ){
					this.fncComplete();
					return this;
				}
				this.idx ++;
				this.fnc( this, this.ary[this.idxs[this.idx]], this.idxs[this.idx] );
				return this;
			}
			this.next();
		})(ary, fnc, fncComplete);
	}

	/**
	 * 関数の直列処理
	 */
	exports.iterateFnc = function(aryFuncs){
		function iterator( aryFuncs ){
			aryFuncs = aryFuncs||[];

			var idx = 0;
			var funcs = aryFuncs;

			this.start = function(arg){
				arg = arg||{};
				if(funcs.length <= idx){return this;}
				(funcs[idx++])(this, arg);
				return this;
			}

			this.next = this.start;
		}
		return new iterator(aryFuncs);
	}

	/**
	 * URLを開く
	 */
	exports.openURL = function( url ){
		var cmd = 'open';
		if(_platform=='win'){
			cmd = 'explorer';
			if( url.match(new RegExp('^(?:https?|data)\\:','i')) ){
				// OS依存しないのでスルー
			}else if( _fs.existsSync(url) ){
				url = _fs.realpathSync(url);
			}
		}
		return this.spawn( cmd, [url], {} );
	}

	/**
	 * ディレクトリ名を得る
	 * phpJSから拝借
	 */
	exports.dirname = function(path){
		return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
	}

	/**
	 * 正規表現で使えるようにエスケープ処理を施す
	 */
	exports.escapeRegExp = function(str) {
		if( typeof(str) !== typeof('') ){return str;}
		return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
	}

	/**
	 * パス文字列を解析する
	 */
	exports.parsePath = function( path ){
		var rtn = {};
		rtn.path = path;
		rtn.basename = this.basename( rtn.path );
		rtn.dirname = this.dirname( rtn.path );
		rtn.ext = rtn.basename.replace( new RegExp('^.*\\.'), '' );
		rtn.basenameExtless = rtn.basename.replace( new RegExp('\\.'+this.escapeRegExp(rtn.ext)+'$'), '' );
		return rtn;
	}

	/**
	 * パス文字列から、ファイル名を取り出す
	 */
	exports.basename = function( path ){
		var rtn = '';
		rtn = path.replace( new RegExp('^.*\\/'), '' );
		return rtn;
	}

	/**
	 * 新規ディレクトリを作成する
	 */
	exports.mkdir = function(path){
		if( _fs.existsSync(path) ){
			return true;
		}
		_fs.mkdirSync(path, 0777);
		return true;
	}

	/**
	 * ファイルまたはディレクトリが存在するか調べる
	 */
	exports.fileExists = function(path){
		if( !_fs.existsSync(path) ){
			return false;
		}
		return true;
	}

	/**
	 * パス情報から、拡張子を除いたファイル名を取得する。
	 *
	 * @param string $path 対象のパス
	 * @return string 拡張子が除かれたパス
	 */
	exports.trimExtension = function( $path ){
		var $pathinfo = this.parsePath( $path );
		var $RTN = $path.replace( new RegExp('\\.'+this.escapeRegExp( $pathinfo.ext )+'$') , '' );
		return $RTN;
	}

	/**
	 * ファイルが存在するか調べる
	 */
	exports.isFile = function(path){
		if( !this.fileExists(path) ){
			return false;
		}
		if( !_fs.statSync(path).isFile() ){
			return false;
		}
		return true;
	}

	/**
	 * ディレクトリが存在するか調べる
	 */
	exports.isDirectory = function(path){
		if( !this.fileExists(path) ){
			return false;
		}
		if( !_fs.statSync(path).isDirectory() ){
			return false;
		}
		return true;
	}

	exports.mkdirAll = function(path){
		if( this.fileExists(path) ){
			return true;
		}
		this.mkdirAll(this.dirname(path));
		this.mkdir(path, 0777);
		return true;
	}

	/**
	 * パスから拡張子を取り出して返す
	 */
	exports.getExtension = function(path){
		var ext = path.replace( new RegExp('^.*?\.([a-zA-Z0-9\_\-]+)$'), '$1' );
		return ext;
	}

	/**
	 * 致命的エラーを発生させる。
	 * エラーメッセージを出力して終了する。
	 */
	exports.fatalError = function( message ){
		console.log('[ERROR] ' + message);
		process.exit();
		return;
	}

	/**
	 * 配列を文字列に連結する
	 * phpJSから拝借
	 */
	exports.implode = function(glue, pieces){
		var i = '',
		retVal = '',
		tGlue = '';
		if (arguments.length === 1) {
			pieces = glue;
			glue = '';
		}
		if (typeof pieces === 'object') {
			if (Object.prototype.toString.call(pieces) === '[object Array]') {
				return pieces.join(glue);
			}
			for (i in pieces) {
				retVal += tGlue + pieces[i];
				tGlue = glue;
			}
			return retVal;
		}
		return pieces;
	}

	/**
	 * 配列をCSV形式に変換する
	 */
	exports.mkCsv = function(ary){
		var rtn = '';
		for( var i1 in ary ){
			for( var i2 in ary[i1] ){
				if(typeof(ary[i1][i2])!==typeof('')){
					ary[i1][i2]='';
					continue;
				}
				ary[i1][i2] = ary[i1][i2].replace(new RegExp('\"', 'g'), '""');
				if( ary[i1][i2].length ){
					ary[i1][i2] = '"'+ary[i1][i2]+'"';
				}
				continue;
			}
			rtn += this.implode(',', ary[i1]) + "\n";
		}
		return rtn;
	}

	/**
	 * ファイルの一覧を取得する
	 */
	exports.ls = function(path){
		if( !this.isDirectory(path) ){ return false; }
		return _fs.readdirSync(path);
	}

	/**
	 * ファイルを複製する
	 */
	exports.copy = function(pathFrom, pathTo){
		if( !this.isFile(pathFrom) ){ return true; }
		var res = _fs.writeFileSync(
			pathTo,
			_fs.readFileSync( pathFrom )
		);
		if( !this.isFile(pathTo) ){
			return false;
		}
		return res;
	}

	/**
	 * ファイルやディレクトリを再帰的に複製する
	 */
	exports.copy_r = function(pathFrom, pathTo){
		if( this.isFile(pathFrom) ){
			// ファイルなら単体コピーに転送
			return this.copy(pathFrom, pathTo);
		}
		if( !this.isDirectory(pathFrom) ){ return true; }

		this.mkdirAll( pathTo );
		var list = this.ls( pathFrom );
		for( var idx in list ){
			this.copy_r( pathFrom+'/'+list[idx], pathTo+'/'+list[idx] );
		}
		return true;
	}

	/**
	 * ファイルを削除する
	 */
	exports.rm = function(path){
		if( !this.isFile(path) ){ return true; }
		return _fs.unlinkSync(path);
	}

	/**
	 * ディレクトリを削除する。
	 *
	 * このメソッドはディレクトリを削除します。
	 * 中身のない、空のディレクトリ以外は削除できません。
	 *
	 * @param string $path 対象ディレクトリのパス
	 * @return bool 成功時に `true`、失敗時に `false` を返します。
	 */
	exports.rmdir = function( $path ){
		return _fs.rmdirSync( $path );
	}//rmdir()

	/**
	 * ディレクトリを再帰的に削除する。
	 *
	 * このメソッドはディレクトリを中身ごと再帰的に削除します。
	 *
	 * @param string $path 対象ディレクトリのパス
	 * @return bool 成功時に `true`、失敗時に `false` を返します。
	 */
	exports.rmdir_r = function( $path ){
		$path = _fs.realpathSync( $path );

		if( this.isFile( $path ) ){
			// ファイルまたはシンボリックリンクの場合の処理
			// ディレクトリ以外は削除できません。
			return false;

		}else if( this.isDirectory( $path ) ){
			// ディレクトリの処理
			var $filelist = this.ls($path);
			for( var idx in $filelist ){
				var $basename = $filelist[idx];
				if( this.isFile( $path+DIRECTORY_SEPARATOR+$basename ) ){
					this.rm( $path+DIRECTORY_SEPARATOR+$basename );
				}else if( !this.rmdir_r( $path+DIRECTORY_SEPARATOR+$basename ) ){
					return false;
				}
			}
			return this.rmdir( $path );
		}

		return false;
	}//rmdir_r()

	/**
	 * ファイルに行を追加する
	 */
	exports.fileAppend = function(path, contents){
		if( !this.isFile(path) ){
			return _fs.writeFileSync( path , contents );
		}

		var stat = _fs.statSync(path);
		var fd = _fs.openSync(path, "a");
		var rtn = _fs.writeSync(fd, contents.toString(), stat.size);
		_fs.closeSync(fd);

		return rtn;
	}


	/**
	 * サーバがUNIXパスか調べる。
	 *
	 * @return bool UNIXパスなら `true`、それ以外なら `false` を返します。
	 */
	exports.isUnix = function(){
		if( DIRECTORY_SEPARATOR == '/' ){
			return true;
		}
		return false;
	}//is_unix()

	/**
	 * サーバがWindowsパスか調べる。
	 *
	 * @return bool Windowsパスなら `true`、それ以外なら `false` を返します。
	 */
	exports.isWindows = function(){
		if( DIRECTORY_SEPARATOR == '\\' ){
			return true;
		}
		return false;
	}//is_windows()


	/**
	 * URIパラメータをパースする
	 */
	exports.parseUriParam = function(url){
		var paramsArray = [];
		parameters = url.split("?");
		if( parameters.length > 1 ) {
			var params = parameters[1].split("&");
			for ( var i = 0; i < params.length; i++ ) {
				var paramItem = params[i].split("=");
				for( var i2 in paramItem ){
					paramItem[i2] = decodeURIComponent( paramItem[i2] );
				}
				paramsArray.push( paramItem[0] );
				paramsArray[paramItem[0]] = paramItem[1];
			}
		}
		return paramsArray;
	}

	/**
	 * Markdown形式のテキストをHTMLに変換
	 */
	exports.markdown = function( src ){
		var marked = require('marked');
		marked.setOptions({
			renderer: new marked.Renderer(),
			gfm: true,
			tables: true,
			breaks: false,
			pedantic: false,
			sanitize: false,
			smartLists: true,
			smartypants: false
		});

		return marked(src);
	}

	/**
	 * Base64 encode
	 */
	exports.base64encode = function( bin ){
		var base64 = bin.toString('base64');
		return base64;
	}

	/**
	 * Base64 decode
	 */
	exports.base64decode = function( base64 ){
		var bin = (new Buffer(base64, 'base64')).toString();
		return bin;
	}

	/**
	 * md5 hash
	 */
	exports.md5 = function( val ){
		var md5 = _crypto.createHash('md5');
		var origin = val+'';
		md5.update( origin, 'utf8' );
		var rtn = md5.digest('hex');
		return rtn;
	}

	/**
	 * strlen
	 */
	exports.strlen = function(str){
		if( typeof(str) !== typeof('') ){
			return 0;
		}
		return str.length;
	}

})(exports);
