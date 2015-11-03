/**
 * API: initPx2ServerEmurator
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);

	console.log('initPx2ServerEmurator: called.');

	var it79 = require('iterate79');

	var serverInfo = {};
	var px2proj;

	it79.fnc({}, [
		function(it1){
			main.px2dtLDA.getProject(
				data.projectIdx,
				function( projectInfo ){
					// console.log(main.getPx2Proj);
					main.getPx2Proj( projectInfo, function(_px2proj){
						px2proj = _px2proj;
						// console.log('message: '+ JSON.stringify(px2proj));
						px2proj.get_config(function(conf){
							// console.log('message: '+ JSON.stringify(conf));
							it1.next( {
								'projectIdx': data.projectIdx ,
								'projectInfo': projectInfo ,
								'config': conf
							} );
						});
					} );
				}
			);
		} ,
		function(it1, pjData){
			// console.log(pjData);
			serverInfo = { // TODO: 仮実装
				'scheme': 'http',
				'port':8080 ,
				'domain': '127.0.0.1'
			};
			var options = {};
			if( data.documentRoot ){
				options.documentRoot = data.documentRoot;
			}
			if( data.staticWeb ){
				options.staticWeb = true;
			}

			main.px2ServerEmurator.init(
				pjData.projectInfo,
				pjData.config,
				px2proj,
				serverInfo ,
				options ,
				function(){
					serverInfo.scheme = main.px2ServerEmurator.getScheme();
					serverInfo.domain = main.px2ServerEmurator.getDomain();
					serverInfo.port = main.px2ServerEmurator.getPort();
					it1.next();
				}
			);
		} ,
		function(it1){
			callback(serverInfo);
		}

	]);


	return;
}
