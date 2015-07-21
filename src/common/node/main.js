/**
 * main.js
 */
module.exports = new (function(){
	var fs = require('fs');
	var desktopUtils = require('desktop-utils');
	var appName = 'youngcorn';
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
	 * フォントDB(JSON)の内容を取得する
	 */
	this.getFontDb = function(cb){
		cb = cb || function(){};
		cb(fontDb);
		return this;
	}

	/**
	 * フォントDB(JSON)の内容をセットする
	 */
	this.setFontDb = function(db, cb){
		cb = cb || function(){};
		fontDb = db;
		cb(true);
		return this;
	}

	/**
	 * フォントDB(JSON)の内容を読み込む
	 */
	this.loadFontDb = function(cb){
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
	 * フォントDB(JSON)の内容を保存する
	 */
	this.saveFontDb = function(cb){
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
