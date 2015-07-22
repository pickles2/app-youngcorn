/**
 * main.js
 */
module.exports = new (function(){
	var packageJson = require(__dirname+'/../../../package.json');
	var fs = require('fs');
	var desktopUtils = require('desktop-utils');
	var appName = packageJson.name;
	var fontDb = {};

	/**
	 * データディレクトリを初期化する
	 */
	this.initDataDir = function(){
		var localDataDir = this.getLocalDataDir();
		if( !fs.existsSync(localDataDir) ){
			if( !fs.mkdirSync(localDataDir) ){
				return false;
			}
		}
		if( !fs.existsSync(localDataDir) ){
			return false;
		}
		return true;
	}

	/**
	 * データディレクトリのパスを取得する
	 */
	this.getLocalDataDir = function(){
		return desktopUtils.getLocalDataDir(appName);
	}
	this.open = desktopUtils.open;

	/**
	 * DB(JSON)の内容を取得する
	 */
	this.getDb = function(cb){
		cb = cb || function(){};
		cb(fontDb);
		return this;
	}

	/**
	 * DB(JSON)の内容をセットする
	 */
	this.setDb = function(db, cb){
		cb = cb || function(){};
		fontDb = db;
		cb(true);
		return this;
	}

	/**
	 * DB(JSON)の内容を読み込む
	 */
	this.loadDb = function(cb){
		cb = cb || function(){};
		if(!this.initDataDir()){
			cb(false);
			return this;
		}
		var localDataDir = this.getLocalDataDir();
		var dbPath = localDataDir+'/db.json';
		if( !fs.existsSync(dbPath) ){
			cb({});
			return this;
		}
		fontDb = require(dbPath);
		cb(fontDb);
		return this;
	}

	/**
	 * DB(JSON)の内容を保存する
	 */
	this.saveDb = function(cb){
		cb = cb || function(){};
		if(!this.initDataDir()){
			cb(false);
			return this;
		}
		var localDataDir = this.getLocalDataDir();
		var dbPath = localDataDir+'/db.json';
		fs.writeFile(dbPath, JSON.stringify(fontDb, null, 1), function(err){
			cb(!err);
		} );
		return this;
	}

})();
