/**
 * API: socketTest
 */
module.exports = function( data, callback, main, socket ){
	socket.send('showSocketTest', data);
	callback(data);
	return;
}
