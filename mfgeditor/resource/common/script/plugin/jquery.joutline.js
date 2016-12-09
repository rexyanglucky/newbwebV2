/*
 * This jQuery plugin displays outline or inline blinking block to make a warning effect for any jQuery Dom Elements.
 * 
 * @author Yili.Zhang && Yuyun.Zhu
 * @version 1.0
 *
 * Copyright (c) 2013 Baitian Info.
 **/

;(function($){
	$.fn.jOutline = function(option){
		var defaults = {
			out : true,
			borderWidth : 1,
			gapWidth : 0,
			borderColor : "#ffc961",		
			animate : false,
			iclass : "",
			event : "hover",
			background : "#fff",
			cnt : "",
			parent : null,
			left : 0,
			top : 0,
			zIndex : 0,
			callback : function(){}
		};
		var opts = $.extend({}, defaults, option);
		var obj = $(this);
		var left,top,height,width;
		var times = 3;

		// 创建Outline
		if(opts.out){
			left = obj.offset().left - opts.borderWidth - opts.gapWidth,
			top = obj.offset().top - opts.borderWidth - opts.gapWidth,
			height = obj.outerHeight() + 2*opts.gapWidth,
			width = obj.outerWidth() + 2*opts.gapWidth;
		}else{
			left = obj.offset().left + opts.gapWidth,
			top = obj.offset().top + opts.gapWidth,
			height = obj.outerHeight() - 2*opts.borderWidth- 2*opts.gapWidth,
			width = obj.outerWidth() - 2*opts.borderWidth - 2*opts.gapWidth;
		}
		if (opts.cnt) {
			var outlineCnt = '<div class="oCnt pa">'+ opts.cnt +'</div>';
		}else{
			var outlineCnt = "";
		}
		var outlineElm = $('<div class="jOutline pa"><div class="oBlock pa" style="font-size:0px; display:block;"></div>'+ outlineCnt +'</div>')
		outlineElm.css({
			height : height,
			width : width,
			left : opts.parent?opts.left:left+opts.borderWidth,
			top : opts.parent?opts.top:top+opts.borderWidth,
			zIndex : opts.parent?opts.zIndex:999
		});
		outlineElm.find(".oBlock").css({
			height : height-opts.borderWidth*2,
			width : width-opts.borderWidth*2,
			border : opts.borderWidth +'px solid '+ opts.borderColor,
			zIndex : opts.parent?opts.zIndex:1000
		});
		outlineElm.find(".oCnt").css({
			zIndex : opts.parent?opts.zIndex:1000
		});
		outlineElm.bind(opts.event,function(){
			$(this).remove();
			opts.callback&&opts.callback();
		});

		$(".jOutline").remove();
		outlineElm.appendTo(opts.parent||$("body"));

		if(opts.iclass){
			outlineElm.addClass(opts.iclass);
		}

		// Outline闪烁
		var blinkInterval = setInterval(function(){
			if(times == 0){
				clearTimeout(blinkInterval);
				// outlineElm.remove();
			}
			blinkHandler(outlineElm.find(".oBlock"));
			times--;
		},140);
		var blinkHandler = function (obj){
			if(opts.out){
				obj.toggle();
			}else{
				times%2 == 0?obj.css("background-color",opts.background):obj.css("background-color",defaults.background);
			}
		}
		return $(this);
	};
})(jQuery);

/*
$(selector).jOutline({
	"out" : true,
	"borderWidth" : 2,
	"gapWidth" : 3,
	"borderColor" : "red",			
	"animate" : false,
	"iclass" : "oSyle_1"
})*/
