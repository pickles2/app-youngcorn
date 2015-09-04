/**
 * conf
 */
(function(exports){

	var fs = require('fs');
	var php = require('phpjs');
	var packageJson = require(__dirname+'/../../package.json');
	var conf = packageJson.baobabConfig;

    conf.defaultPort = conf.defaultPort||8080;
    conf.frontendDocumentRoot = conf.frontendDocumentRoot||false;
    if(conf.frontendDocumentRoot){ conf.frontendDocumentRoot = fs.realpathSync(__dirname+'/../../'+conf.frontendDocumentRoot)+'/'; }
    conf.backendJs = conf.backendJs||false;
    if(conf.backendJs){ conf.backendJs = fs.realpathSync(__dirname+'/../../'+conf.backendJs); }
    conf.backendApis = conf.backendApis||false;
    if(conf.backendApis){ conf.backendApis = fs.realpathSync(__dirname+'/../../'+conf.backendApis)+'/'; }

    exports.get = function(){
        return conf;
    }

})(module.exports);
