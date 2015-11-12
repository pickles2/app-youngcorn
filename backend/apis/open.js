/**
 * API: createNewProject
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);
	var db = {};

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			// プロジェクト情報を取得する
			main.px2dtLDA.getData(
				function( _db ){
					db = _db;
					rlv();
				}
			);
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){

			if(data.in){
				main.desktopUtils.openIn(
					db.apps[data.in] ,
					data.path
				);
			}else{
				main.desktopUtils.open(
					data.path
				);
			}

		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 返却
			callback(true);
			rlv();
		}); })
	;

	return;
}
