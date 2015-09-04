/**
 * API: checkStar
 */
module.exports = new (function(){

	this.run = function( cmd, socket, main ){
		main.getDb(function(db){
			db[cmd.postscriptName].star = true;
			main.setDb(db, function(){
				main.saveDb(function(res){
					console.log(res);
				});
			});
		});
	}

})();
