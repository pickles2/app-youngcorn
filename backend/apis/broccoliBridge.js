/**
 * API: broccoliBridge
 */
module.exports = function( data, callback, main, socket ){
	delete(require.cache[require('path').resolve(__filename)]);
	var path = require('path');
	var it79 = require('iterate79');

	data = data||{};
	callback = callback||function(){};
	// console.log(data);

	var Broccoli = require('broccoli-html-editor');
	var broccoli,
		px2proj;

	it79.fnc(data, [
		function(it1, data){
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
			data.documentRoot = path.resolve(data.projectInfo.path, data.projectInfo.entry_script, '..')+'/'
			px2proj.realpath_files(data.path, '', function(realpath){
				data.realpathDataDir = path.resolve(realpath, 'guieditor.ignore')+'/';

				px2proj.path_files(data.path, '', function(localpath){
					data.pathResourceDir = path.resolve(localpath, 'resources')+'/';
					it1.next(data);
				});

			});
		} ,
		function(it1, data){
			// console.log(data);
			// console.log(data.conf.plugins.px2dt);

			// broccoli setup.
			broccoli = new Broccoli();

			// console.log(broccoli);
			broccoli.init(
				{
					'paths_module_template': data.conf.plugins.px2dt.paths_module_template ,
					'documentRoot': data.documentRoot,
					'pathHtml': data.path,
					'pathResourceDir': data.pathResourceDir,
					'realpathDataDir': data.realpathDataDir,
					'customFields': {
						'table': require('broccoli-html-editor--table-field'),
						'psd': require('broccoli-psd-field')
					} ,
					'bindTemplate': function(htmls, callback){
						var fin = '';
						for( var bowlId in htmls ){
							if( bowlId == 'main' ){
								fin += htmls['main']+"\n";
								fin += "\n";
							}else{
								fin += '<?php ob_start(); ?>'+"\n";
								fin += htmls[bowlId]+"\n";
								fin += '<?php $px->bowl()->send( ob_get_clean(), '+JSON.stringify(bowlId)+' ); ?>'+"\n";
								fin += "\n";
							}
						}
						callback(fin);
						return;
					}

				},
				function(){
					it1.next(data);
				}
			);
		} ,
		function(it1, data){
			if(data.api == 'gpiBridge'){
				broccoli.gpi(
					data.bridge.api,
					data.bridge.options,
					function(rtn){
						it1.next(rtn);
					}
				);
				return ;

			}

			setTimeout(function(){
				data.messageByBackend = 'Callbacked by backend API "broccoli".';
				it1.next(data);
			}, 0);
			return;

		} ,
		function(it1, data){
			callback(data);
			it1.next(data);
		}
	]);


	return;
}
