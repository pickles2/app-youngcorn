/**
 * API: updateFontInfo
 */
module.exports = new (function(){

	this.run = function( cmd, socket, main ){
		switch(cmd.key){
			case 'star':
			case 'url':
			case 'license':
			case 'comment':
				break;
			default:
				console.log(false);
				return;
				break;
		}
		main.getFontDb(function(db){
			if( typeof(db)!==typeof({}) ){ console.log(false); return; }
			if( !db[cmd.postscriptName] ){ console.log(false); return; }

			db[cmd.postscriptName][cmd.key] = cmd.val;
			main.setFontDb(db, function(){
				main.saveFontDb(function(res){
					console.log(res);
				});
			});
		});
	}

})();
