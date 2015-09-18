/**
 * API: twig
 */
module.exports = function( data, callback, main, socket ){

	// console.log(twig);
	// console.log(data);

	setTimeout(function(){
		var html = window.twig({
			'data': data.template
		}).render(data.data);

		// console.log(html);
		callback(html);
	}, 0);

	return;
}
