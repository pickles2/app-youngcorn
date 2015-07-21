/**
 * API: uncheckStar
 */
module.exports = new (function(){

	this.run = function( cmd, socket, main ){
		main.getFontDb(function(db){
			db[cmd.postscriptName].star = false;
			main.setFontDb(db, function(){
				main.saveFontDb(function(res){
					console.log(res);
				});
			});
		});
	}

})();
