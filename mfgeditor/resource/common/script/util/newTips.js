/*
@param settings : 数组[]，每一个元素是一个数组[name,selector,opts]，这个数组元素具体如下：
	[1]: name 名称（自定，不要太长）
	[2]: selector 选择器，加new标签的元素
	[3]: opts object 对象，包括
		 	isApply : 是否启用，默认true
		 	top：new标签的定位top，默认-12
			right: new标签的定位right，默认-10
			tipsHtml : 要添加的tips的样式
	如：settings = [["name1",".selector1"],
					["name2",".selector2",{isApply:false,top:0,right:0}]];
 */

var NewTips = function(){
	this._o = {};
	this.clickedTips = [];
}
NewTips.prototype.init = function(settings){
	var t = this;
	$.each(settings,function(key,val){
		t.createTipsFun.apply(t,val);
	});
	this.getUserTips();
	this.showTips();
};
NewTips.prototype.createTipsFun = function(name,selector,opts){
	var opt = {
		isApply : true,
		top: -12,
		right: -10
	};
	$.extend(opt,opts || {});
	this._o[name] = {
		isApply: opt.isApply,
		userApply: true,//用户没有点击过的标记
		selector: selector,
		opts: opt,
		name: name,
		addTips: this.addTips,
		removeTips: $.proxy(this.removeTips,this)
	};
};
NewTips.prototype.showTips = function(){
	$.each(this._o,function(key,val){
		val.addTips.call(val);
	});
};
NewTips.prototype.addTips = function(){
	if(this.isApply && this.userApply){
		var t = this;
		var $t = $(t.selector);
		if($t.length && !$t.find('.newTips').length){
			if(!$t[0].style.position){
				$t.css("position","relative");
			}
			if(t.opts.tipsHtml){
				$(t.opts.tipsHtml).addClass("newTips").appendTo($t);
			}else{
				$t.append('<em class="newTips" style="display:block;z-index:100;width:22px;height:12px;background:url(http://static.7wenta.com/qa/style/img_s/new.png) 0 0 no-repeat;position:absolute;right:'+ 
					t.opts.right +'px;top:'+ t.opts.top +'px;"></em>');
			}
			$t.one("click",function(){
				t.removeTips(t);
			});
		}
	}
};
NewTips.prototype.removeTips = function(target){
	target.userApply = false;
	$(target.selector).children(".newTips").remove();
	this.addUserTips(target.name);
}
NewTips.prototype.getUserTips = function(){
	var clickedTip = $.cookie("tips");
	if(clickedTip){
		var clickedTips = clickedTip.split(",");
		var t = this;
		$.each(clickedTips,function(key,val){
			var cur = t._o[val];
			if(cur && cur.isApply){
				t.clickedTips.push(val);
				cur.userApply = false;
			}
		});
		if(clickedTips.length != this.clickedTips.length){
			this.changeUserTips();
		}
	}else{
		deleteOldCookie();
	}
};
NewTips.prototype.changeUserTips = function(){
	$.cookie("tips",this.clickedTips.join(","),{expires: 365,domain: ".7wenta.com",path: "/"});
};
NewTips.prototype.addUserTips = function(name){
	this.clickedTips.push(name);
	this.changeUserTips();
};

//删除旧的cookie
function deleteOldCookie(){
	var cookieStr = document.cookie;
	if(cookieStr){
		var cookieArr = cookieStr.split(';');
		$.each(cookieArr,function(key,val){
			var ck = $.trim(val.split("=")[0]);
			if(/(newTips|newBool)\d*/.test(ck)){
				$.cookie(ck,null, {expires: -1,domain: ".7wenta.com",path: "/"});
			}
		});
	}
}