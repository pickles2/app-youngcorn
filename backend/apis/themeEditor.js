/**
 * API: broccoliBridge
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);
	var fs = require('fs');
	var path = require('path');
	var it79 = require('iterate79');

	data = data||{};
	callback = callback||function(){};
	// console.log(data);

	var px2proj;

	it79.fnc(data, [
		function(it1, data){
			data.return = {};
			main.px2dtLDA.getProject(
				data.projectIdx,
				function( projectInfo ){
					// console.log(main.getPx2Proj);
					data.projectInfo = projectInfo;

					main.getPx2Proj( projectInfo, function(_px2proj){
						// console.log('message: '+ JSON.stringify(_px2proj));
						px2proj = _px2proj;

						px2proj.get_config(function(conf){
							// console.log('message: '+ JSON.stringify(conf));
							data.conf = conf;

							px2proj.get_path_homedir(function(path_homedir){
								// console.log('message: '+ JSON.stringify(path_homedir));
								data.path_homedir = path_homedir;
								it1.next(data);
							});
						});
					} );
				}
			);
		} ,
		function(it1, data){
			var path_themeDir = path.resolve( data.path_homedir + '/themes/broccoli/' )+'/';

			switch( data.api ){
				case 'getLayoutList':
					(function(){
						var files = fs.readdirSync(path_themeDir);
						var layoutList = [];
						for(var idx in files){
							var basename = files[idx];
							if( fs.statSync(path_themeDir+basename).isDirectory() ){

							}else if( fs.statSync(path_themeDir+basename).isFile() ){
								if( basename.match(/[\\.]html$/) ){
									layoutList.push( basename.replace(/[\\.]html$/, '') );
								}
							}
						}
						data.return = layoutList;

						it1.next(data);
					})();
					break;
				case 'createNewLayout':
					(function(){
						var filepath = path_themeDir+'/'+data.layoutName+'.html';
						try {
							if( fs.statSync(filepath) ){
								data.return.message = data.layoutName+' は既に存在します。';
								data.return.result = false;
								it1.next(data);
								return;
							}
						} catch (e) {
						}
						var src = '';
						src += '<!DOCTYPE html>'+"\n";
						src += '<html>'+"\n";
						src += '<head>'+"\n";
						src += '</head>'+"\n";
						src += '<body data-px2-contents-theme-editor="main">'+"\n";
						src += '</body>'+"\n";
						src += '</html>'+"\n";
						fs.writeFileSync(filepath, src);
						data.return.result = true;

						it1.next(data);
					})();
					break;
				case 'removeLayout':
					(function(){
						fs.unlinkSync(path_themeDir+'/'+data.layoutName+'.html');
						data.return.result = true;
						it1.next(data);
					})();
					break;
				default:
					break;
			}
			return;
		} ,
		function(it1, data){
			callback(data.return);
			it1.next(data);
		}
	]);


	return;
}
