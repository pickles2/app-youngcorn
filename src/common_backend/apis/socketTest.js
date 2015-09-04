/**
 * API: socketTest
 */
module.exports = new (function(){

	this.run = function( cmd, socket, main ){
		socket.callback('showSocketTest', cmd);
		return;
	}

})();
