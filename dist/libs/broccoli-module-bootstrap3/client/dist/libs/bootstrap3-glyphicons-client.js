module.exports = function(broccoli){

	require('m-util');
	var it79 = require('iterate79');
	var php = require('phpjs');
	var resouce = require('br-resouce');
	var mLog = require('m-log');
	var _ = require('underscore');

	var _resMgr = broccoli.resourceMgr;
	var _icons = [{"value":"asterisk", "label":"&#x2a"},
	{"value":"plus", "label":"&#x2b"},
	{"value":"euro", "label":"&#x20ac"},
	{"value":"minus", "label":"&#x2212"},
	{"value":"cloud", "label":"&#x2601"},
	{"value":"envelope", "label":"&#x2709"},
	{"value":"pencil", "label":"&#x270f"},
	{"value":"glass", "label":"&#xe001"},
	{"value":"music", "label":"&#xe002"},
	{"value":"search", "label":"&#xe003"},
	{"value":"heart", "label":"&#xe005"},
	{"value":"star", "label":"&#xe006"},
	{"value":"star-empty", "label":"&#xe007"},
	{"value":"user", "label":"&#xe008"},
	{"value":"film", "label":"&#xe009"},
	{"value":"th-large", "label":"&#xe010"},
	{"value":"th", "label":"&#xe011"},
	{"value":"th-list", "label":"&#xe012"},
	{"value":"ok", "label":"&#xe013"},
	{"value":"remove", "label":"&#xe014"},
	{"value":"zoom-in", "label":"&#xe015"},
	{"value":"zoom-out", "label":"&#xe016"},
	{"value":"off", "label":"&#xe017"},
	{"value":"signal", "label":"&#xe018"},
	{"value":"cog", "label":"&#xe019"},
	{"value":"trash", "label":"&#xe020"},
	{"value":"home", "label":"&#xe021"},
	{"value":"file", "label":"&#xe022"},
	{"value":"time", "label":"&#xe023"},
	{"value":"road", "label":"&#xe024"},
	{"value":"download-alt", "label":"&#xe025"},
	{"value":"download", "label":"&#xe026"},
	{"value":"upload", "label":"&#xe027"},
	{"value":"inbox", "label":"&#xe028"},
	{"value":"play-circle", "label":"&#xe029"},
	{"value":"repeat", "label":"&#xe030"},
	{"value":"refresh", "label":"&#xe031"},
	{"value":"list-alt", "label":"&#xe032"},
	{"value":"lock", "label":"&#xe033"},
	{"value":"flag", "label":"&#xe034"},
	{"value":"headphones", "label":"&#xe035"},
	{"value":"volume-off", "label":"&#xe036"},
	{"value":"volume-down", "label":"&#xe037"},
	{"value":"volume-up", "label":"&#xe038"},
	{"value":"qrcode", "label":"&#xe039"},
	{"value":"barcode", "label":"&#xe040"},
	{"value":"tag", "label":"&#xe041"},
	{"value":"tags", "label":"&#xe042"},
	{"value":"book", "label":"&#xe043"},
	{"value":"bookmark", "label":"&#xe044"},
	{"value":"print", "label":"&#xe045"},
	{"value":"camera", "label":"&#xe046"},
	{"value":"font", "label":"&#xe047"},
	{"value":"bold", "label":"&#xe048"},
	{"value":"italic", "label":"&#xe049"},
	{"value":"text-height", "label":"&#xe050"},
	{"value":"text-width", "label":"&#xe051"},
	{"value":"align-left", "label":"&#xe052"},
	{"value":"align-center", "label":"&#xe053"},
	{"value":"align-right", "label":"&#xe054"},
	{"value":"align-justify", "label":"&#xe055"},
	{"value":"list", "label":"&#xe056"},
	{"value":"indent-left", "label":"&#xe057"},
	{"value":"indent-right", "label":"&#xe058"},
	{"value":"facetime-video", "label":"&#xe059"},
	{"value":"picture", "label":"&#xe060"},
	{"value":"map-marker", "label":"&#xe062"},
	{"value":"adjust", "label":"&#xe063"},
	{"value":"tint", "label":"&#xe064"},
	{"value":"edit", "label":"&#xe065"},
	{"value":"share", "label":"&#xe066"},
	{"value":"check", "label":"&#xe067"},
	{"value":"move", "label":"&#xe068"},
	{"value":"step-backward", "label":"&#xe069"},
	{"value":"fast-backward", "label":"&#xe070"},
	{"value":"backward", "label":"&#xe071"},
	{"value":"play", "label":"&#xe072"},
	{"value":"pause", "label":"&#xe073"},
	{"value":"stop", "label":"&#xe074"},
	{"value":"forward", "label":"&#xe075"},
	{"value":"fast-forward", "label":"&#xe076"},
	{"value":"step-forward", "label":"&#xe077"},
	{"value":"eject", "label":"&#xe078"},
	{"value":"chevron-left", "label":"&#xe079"},
	{"value":"chevron-right", "label":"&#xe080"},
	{"value":"plus-sign", "label":"&#xe081"},
	{"value":"minus-sign", "label":"&#xe082"},
	{"value":"remove-sign", "label":"&#xe083"},
	{"value":"ok-sign", "label":"&#xe084"},
	{"value":"question-sign", "label":"&#xe085"},
	{"value":"info-sign", "label":"&#xe086"},
	{"value":"screenshot", "label":"&#xe087"},
	{"value":"remove-circle", "label":"&#xe088"},
	{"value":"ok-circle", "label":"&#xe089"},
	{"value":"ban-circle", "label":"&#xe090"},
	{"value":"arrow-left", "label":"&#xe091"},
	{"value":"arrow-right", "label":"&#xe092"},
	{"value":"arrow-up", "label":"&#xe093"},
	{"value":"arrow-down", "label":"&#xe094"},
	{"value":"share-alt", "label":"&#xe095"},
	{"value":"resize-full", "label":"&#xe096"},
	{"value":"resize-small", "label":"&#xe097"},
	{"value":"exclamation-sign", "label":"&#xe101"},
	{"value":"gift", "label":"&#xe102"},
	{"value":"leaf", "label":"&#xe103"},
	{"value":"fire", "label":"&#xe104"},
	{"value":"eye-open", "label":"&#xe105"},
	{"value":"eye-close", "label":"&#xe106"},
	{"value":"warning-sign", "label":"&#xe107"},
	{"value":"plane", "label":"&#xe108"},
	{"value":"calendar", "label":"&#xe109"},
	{"value":"random", "label":"&#xe110"},
	{"value":"comment", "label":"&#xe111"},
	{"value":"magnet", "label":"&#xe112"},
	{"value":"chevron-up", "label":"&#xe113"},
	{"value":"chevron-down", "label":"&#xe114"},
	{"value":"retweet", "label":"&#xe115"},
	{"value":"shopping-cart", "label":"&#xe116"},
	{"value":"folder-close", "label":"&#xe117"},
	{"value":"folder-open", "label":"&#xe118"},
	{"value":"resize-vertical", "label":"&#xe119"},
	{"value":"resize-horizontal", "label":"&#xe120"},
	{"value":"hdd", "label":"&#xe121"},
	{"value":"bullhorn", "label":"&#xe122"},
	{"value":"bell", "label":"&#xe123"},
	{"value":"certificate", "label":"&#xe124"},
	{"value":"thumbs-up", "label":"&#xe125"},
	{"value":"thumbs-down", "label":"&#xe126"},
	{"value":"hand-right", "label":"&#xe127"},
	{"value":"hand-left", "label":"&#xe128"},
	{"value":"hand-up", "label":"&#xe129"},
	{"value":"hand-down", "label":"&#xe130"},
	{"value":"circle-arrow-right", "label":"&#xe131"},
	{"value":"circle-arrow-left", "label":"&#xe132"},
	{"value":"circle-arrow-up", "label":"&#xe133"},
	{"value":"circle-arrow-down", "label":"&#xe134"},
	{"value":"globe", "label":"&#xe135"},
	{"value":"wrench", "label":"&#xe136"},
	{"value":"tasks", "label":"&#xe137"},
	{"value":"filter", "label":"&#xe138"},
	{"value":"briefcase", "label":"&#xe139"},
	{"value":"fullscreen", "label":"&#xe140"},
	{"value":"dashboard", "label":"&#xe141"},
	{"value":"paperclip", "label":"&#xe142"},
	{"value":"heart-empty", "label":"&#xe143"},
	{"value":"link", "label":"&#xe144"},
	{"value":"phone", "label":"&#xe145"},
	{"value":"pushpin", "label":"&#xe146"},
	{"value":"usd", "label":"&#xe148"},
	{"value":"gbp", "label":"&#xe149"},
	{"value":"sort", "label":"&#xe150"},
	{"value":"sort-by-alphabet", "label":"&#xe151"},
	{"value":"sort-by-alphabet-alt", "label":"&#xe152"},
	{"value":"sort-by-order", "label":"&#xe153"},
	{"value":"sort-by-order-alt", "label":"&#xe154"},
	{"value":"sort-by-attributes", "label":"&#xe155"},
	{"value":"sort-by-attributes-alt", "label":"&#xe156"},
	{"value":"unchecked", "label":"&#xe157"},
	{"value":"expand", "label":"&#xe158"},
	{"value":"collapse-down", "label":"&#xe159"},
	{"value":"collapse-up", "label":"&#xe160"},
	{"value":"log-in", "label":"&#xe161"},
	{"value":"flash", "label":"&#xe162"},
	{"value":"log-out", "label":"&#xe163"},
	{"value":"new-window", "label":"&#xe164"},
	{"value":"record", "label":"&#xe165"},
	{"value":"save", "label":"&#xe166"},
	{"value":"open", "label":"&#xe167"},
	{"value":"saved", "label":"&#xe168"},
	{"value":"import", "label":"&#xe169"},
	{"value":"export", "label":"&#xe170"},
	{"value":"send", "label":"&#xe171"},
	{"value":"floppy-disk", "label":"&#xe172"},
	{"value":"floppy-saved", "label":"&#xe173"},
	{"value":"floppy-remove", "label":"&#xe174"},
	{"value":"floppy-save", "label":"&#xe175"},
	{"value":"floppy-open", "label":"&#xe176"},
	{"value":"credit-card", "label":"&#xe177"},
	{"value":"transfer", "label":"&#xe178"},
	{"value":"cutlery", "label":"&#xe179"},
	{"value":"header", "label":"&#xe180"},
	{"value":"compressed", "label":"&#xe181"},
	{"value":"earphone", "label":"&#xe182"},
	{"value":"phone-alt", "label":"&#xe183"},
	{"value":"tower", "label":"&#xe184"},
	{"value":"stats", "label":"&#xe185"},
	{"value":"sd-video", "label":"&#xe186"},
	{"value":"hd-video", "label":"&#xe187"},
	{"value":"subtitles", "label":"&#xe188"},
	{"value":"sound-stereo", "label":"&#xe189"},
	{"value":"sound-dolby", "label":"&#xe190"},
	{"value":"sound-5-1", "label":"&#xe191"},
	{"value":"sound-6-1", "label":"&#xe192"},
	{"value":"sound-7-1", "label":"&#xe193"},
	{"value":"copyright-mark", "label":"&#xe194"},
	{"value":"registration-mark", "label":"&#xe195"},
	{"value":"cloud-download", "label":"&#xe197"},
	{"value":"cloud-upload", "label":"&#xe198"},
	{"value":"tree-conifer", "label":"&#xe199"},
	{"value":"tree-deciduous", "label":"&#xe200"}
	];

	var _this = this;


	//  Server Side  | <Client Side>
	// --------------+-------------------
	// bind          |
	// mkPreviewHtml | mkPreviewHtml
	// normalizeData | normalizeData
	//               | mkEditor
	//               | duplicateData
	//               | saveEditorContent
	// gpi           |

	/**
	 * プレビュー用の簡易なHTMLを生成する
	 */
	this.mkPreviewHtml = function( fieldData, mod, callback ){
		console.log('mkPreviewHtml', 'client');
		var rtn = {}
		if( typeof(fieldData) === typeof({}) ){
			rtn = fieldData;
		}
		_resMgr.getResource( rtn.resKeyEditPng, function(res){
			callback(rtn.get(0).outerHTML);
		} );
		return;
	}

	/**
	 * データを正規化する
	 */
	this.normalizeData = function( fieldData, mode ){
		var rtn = fieldData;
		if( typeof(fieldData) !== typeof({}) ){
			rtn = {
				"resKey":'',
				"path":'about:blank'
			};
		}
		return rtn;
	}

	/**
	 * エディタUIを生成
	 */
	this.mkEditor = function( mod, data, elm, callback ){
		var rtn = $('<div>');

		var htmlIconList = (function() {/*
		<li>
			<label>
			<input type="radio" name="glyphicon" value="<%= iconData %>" style="display:block;">
				<div>
					<span class="glyphicon glyphicon-<%= iconData %>" aria-hidden="true"></span>
					<span class="glyphicon-class">glyphicon glyphicon-<%= iconData %></span>
				</div>
			</label>
		</li>
		*/}).toString().uHereDoc();
		var _htmlIconList = _.template(htmlIconList);
		$ul = $('<ul class="bs-glyphicons-list">');
		for (var icon_i = 0; icon_i < _icons.length; icon_i++) {
			$ul.append($(_htmlIconList({
				'iconData': _icons[icon_i].value
			})));
		}
		rtn.append($('<div class="bs-glyphicons">').append($ul));
		$(elm).html(rtn);

		// 描画後の処理
		var _default_val = $('input[name="glyphicon"]').get(0).value;
		var _checked_val = $('input[name="glyphicon"]:checked').val();
		if(_checked_val === undefined){
			$('input[name="glyphicon"][value="' + _default_val +'"]').prop('checked', true);
		}

		callback();
		return;
	}

	/**
	 * データを複製する
	 */
	this.duplicateData = function( data, callback ){
		data = JSON.parse( JSON.stringify( data ) );
		it79.fnc(
			data,
			[
				function(it1, data){
					_resMgr.duplicateResource( data.resKey, function(newResKey){
						data.resKey = newResKey;
						it1.next(data);
					} );
				} ,
				function(it1, data){
					_resMgr.getResourcePublicPath( data.resKey, function(publicPath){
						data.PngPath = publicPath;
						it1.next(data);
					} );
				} ,
				function(it1, data){
					callback(data);
					it1.next(data);
				}
			]
		);
		return;
	}// this.duplicateData

	/**
	 * エディタUIで編集した内容を保存
	 */
	this.saveEditorContent = function( elm, data, mod, callback ){
		var _this = this;
		var resInfo;
		var $dom = $(elm);
		if( typeof(data) !== typeof({}) ){
			data = {};
		}
		if( typeof(data.resKey) !== typeof('') ){
			data.resKey = '';
		}
		it79.fnc(
			data,
			[
				function(it1, data){
					_resMgr.getResource(data.resKey, function(result){
						if( result === false ){
							_resMgr.addResource(function(newResKey){
								data.resKey = newResKey;
								it1.next(data);
							});
							return;
						}
						it1.next(data);
					});
				} ,
				function(it1, data){
					_resMgr.getResource(data.resKey, function(res){
						resInfo = res;
						it1.next(data);
					});
					return;
				} ,
				function(it1, data){
						_resMgr.updateResource(data.resKey, resInfo, function(){
							data.base64 = $dom.find('input[name="glyphicon"]:checked').val();
							it1.next(data);
						});
						return;
					it1.next(data);
					return ;
				},
				function(it1, data){
					// console.log(data);
					callback(data);
					it1.next(data);
				}
			]
		);
	}// this.saveEditorContent()
}
