/**
 * main.js
 */
window.main = new (function($){
	var it79 = this.it79 = require('iterate79');
	var __dirname = (function(){ var rtn = (function() { if (document.currentScript) {return document.currentScript.src;} else { var scripts = document.getElementsByTagName('script'), script = scripts[scripts.length-1]; if (script.src) {return script.src;} } })(); rtn = rtn.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, ''); return rtn; })();
	var socket = require('../../framework/baobabFw/main.js')
		.createSocket(
			this,
			io,
			'http://'+window.location.host,
			{
				'renderFontList': require('./apis/renderFontList.js')
			}
		)
	;

	function windowResized(){
		console.log('window resized');
	}

	/**
	 * initialize
	 * @param  {Function} callback Callback function.
	 * @return {Object}            return this;
	 */
	this.init = function(callback){
		callback = callback || function(){};
		window.focus();
		$(window).resize(windowResized);

		setTimeout(function(){callback();}, 0);
		return this;
	}

})(jQuery);
