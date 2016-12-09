In.add('addFollowing_js',{path:static_domain+'resource/formulaEditor/air/qaEditor/jquery.addFollowing.js'+buildVersion,type:'js',charset:'utf-8'});
In.add('jOutline_js',{path:static_domain+'resource/common/script/plugin/jquery.joutline.js'+buildVersion,type:'js',charset:'utf-8'});
In.add('keyboard_css',{path:static_domain+'resource/formulaEditor/air/feEditor/feEditor.css' + buildVersion,type:'css',charset:'utf-8'});
In.add('keyboard_js',{path:static_domain+'resource/formulaEditor/air/keyboard.js'+buildVersion,type:'js',charset:'utf-8',rely:['keyboard_css']});

/*
 * 提问编辑框控件
 *
 **/
var qaEditor = function(opts){
	var _defaults = {
		parent : $("body"),
		actionUrl : qa_domain + "addWenTi.json",
		uploadImgUrl: "http://upload.7wenta.com/check/pic_upload.json?appType=1",
		type : 0, //0:addWenTi;1:addWenTi2Teacher
		sub : true,
		form : true,
		param : {},
		iclass : "",
		maxLen : 1000,
		isubmit : "提 交",
		errorTip : "你还没输入提问内容或图片哦~",
		textCnt : "请输入你的问题或上传图片",
		btnTips: 1, //上传图片按钮下面的提示语，1为手机提示语，2为大学生系统提示语
		submitCallback : function(){},
		submitClick : function(){},
		submitLogin : null,
		failCallback: null
	};
	this.settings = $.extend({},_defaults,opts);

	var _frame = '<div class="qaEditor latex-outer pr '+ this.settings.iclass +'">\
					<div class="backFocusLayer pa hide"></div>\
					<div class="feTextArea latex-table pa"></div>\
					<textarea class="textArea latex-textarea cS pa"></textarea>\
					<div class="textArea_tips latex-tip feTip pa">'+ this.settings.textCnt +'</div>\
					<div class="subBtnWrp pa '+ (this.settings.sub?"":"hide") +'">\
						<a href="###" hidefocus class="subBtn qa-btn clearfix">\
							<span class="btn-icon qsp l"></span>\
							<span class="btn-text l">年级/学科</span>\
							<span class="btn-arrow qsp l"></span>\
						</a>\
					</div>\
					<div class="fomBtnWrp pa latex-clickBtn">\
						<a href="###" hidefocus class="fomBtn qa-btn clearfix">\
							<span class="btn-icon qsp l"></span>\
							<span class="btn-text l">公式</span>\
							<span class="btn-arrow qsp l"></span>\
						</a>\
					</div>\
					<div class="picBtnWrp pa">\
						<a href="###" hidefocus class="picBtn qa-btn clearfix">\
							<span class="btn-icon qsp picIcon l"></span>\
							<span class="btn-text l">上传图片</span>\
						</a>\
						<div class="uploadSuc_tips hide"></div>\
						<div class="picPre pa hide"><img class="wh" src=""/><div class="picDel pa"></div></div>\
					</div>\
					<div class="cardBtnWrp pa hide">\
						<a href="###" hidefocus class="cardBtn qa-btn clearfix">\
							<span class="btn-icon qsp l"></span>\
							<span class="btn-text l"><span class="val"></span><span class="key">提问卡</span></span>\
						</a>\
					</div>\
					<div class="rewardWrp pa"></div>\
					<a href="###" hidefocus class="swtBtn pa">'+ ((this.settings.type == 1)?"普通提问":"问老师") + '&gt;&gt;</a>\
					<a href="###" hidefocus class="submitBtn qsp pa">'+ this.settings.isubmit +'</a>\
					<span class="wordNum pa"><span class="val">0</span>/<span class="maxLen">'+ this.settings.maxLen +'</span></span>\
				</div>';
	this.frame = $(_frame);

	this.init();
}
qaEditor.prototype.change = function(opts) {
	var _self = this;
	$.extend(_self.settings,opts);
	var $frame = this.frame;
	var $submitBtn = $frame.find(".submitBtn");
	var $maxLen = $frame.find(".maxLen");

	$submitBtn.html(_self.settings.isubmit);
	$maxLen.html(_self.settings.maxLen);
};
/*
 * 年级学科模块
 *
 **/
qaEditor.prototype.subjectModule = function() {
	var $frame = this.frame;
	var $subBtn = $frame.find(".subBtnWrp");
	var $textArea = $frame.find(".feTextArea");
	var $textArea2 = $frame.find(".textArea");
	var nkMapper = {};

	$.getJSON('/showcates.json',{},function(data){
		var cates = data.value;
		var njItem = kmList = "";
		$.each(cates,function(k,v){
			var kmItem = "";
			$.each(v.subjlv2s,function(k,v){
				kmItem += '<li class="kmItem" kmindex="'+ v.id +'"><a href="###" class="kmLink">'+ v.name +'</a></li>';
			});
			njItem += '<li class="njItem" njindex="'+ v.id +'"><a href="###" class="njLink">'+ v.name +'<span class="ar"></span></a></li>';
			
			kmList += '<ul class="kmList lil clearfix" njindex="'+ v.id +'" njname="'+ v.name +'">'+ kmItem +'</ul>';
		});
		var nkListHTMl = '<div class="nkList pa">'
							+'<div class="njListWrp">'
								+'<ul class="njList lil clearfix">'
								+ njItem
								+'</ul>'
							+'</div>'
							+'<div class="kmListWrp pa">'
							+ kmList
							+'</div>'
						+'</div>';

		$(nkListHTMl).appendTo($subBtn);

		$subBtn.mouseenter(function(){
			$(".njList .njItem").removeClass("li-cur");
			$(".kmList").hide();
			$(".kmListWrp,.nkList").show();
		}).mouseleave(function(){$(".nkList").hide();}).click(function(){
			return false;
		});
		$(".nkList").hover(function(){$(this).show();},function(){$(this).hide();});
		var timer;
		$(".kmListWrp").hover(function(){clearTimeout(timer);$(this).show();});
//		 年级列表
		$(".njList .njItem").mouseenter(function(){
			var njindex = $(this).attr("njindex");
			$(".njList .njItem").removeClass("li-cur");
			$(this).addClass("li-cur");
			$(".kmList").each(function(){
				$(this).hide();
				if ($(this).attr("njindex") == njindex) {
					$(this).show();
				};
			});
		}).click(function(){return false;});
		$(".njList").mouseleave(function(){
			timer = setTimeout(function(){
				$(".kmListWrp").hide();
			},100);
		});
		// 科目列表
		$frame.find(".kmList .kmItem").click(function(){
			var kmindex = $(this).attr("kmindex");
			var njindex = $(this).closest(".kmList").attr("njindex");
			var kmname = $(this).find(".kmLink").html();
			var njname = $(this).closest(".kmList").attr("njname");

			$subBtn.find(".subBtn .btn-text").html(njname+"/"+kmname);
			$(".nkList").hide();
			// 年级学科data设置
			$frame.data("subject",{km:kmindex,nj:njindex});
			$frame.find(".subErrorTipTxt").remove();
			$frame.removeClass("focusStyle");

			getForbidCheatTips(njindex);
			return false;
		});
	});
	function getForbidCheatTips(grade){
		if(grade){
			$.get(qa_domain + 'forbidCheatTips.json',{grade:grade},function(data){
				if(data.result.resultCode.code == 0 && data.result.value.needTips){
					In("wtTips_js",function(){
						wtTips({
							content : data.result.value.tips,
							$refer: $frame
						});
					});
				}
			});
		}
	}
};
/*
 * 公式编辑器模块
 *
 **/
qaEditor.prototype.formulaModule = function() {
	var $frame = this.frame;
	var $fomBtn = $frame.find(".fomBtnWrp");
	var $textArea = $frame.find(".feTextArea");
	var $textArea2 = $frame.find(".textArea");
	
	$fomBtn.click(function(){
		if (!$(this).data("live") && !$frame.data("formula")) {
			var textareaVal = $frame.find(".textArea").val();
			$textArea2.hide();
			$textArea.show();			
			editorCanvas.activeFormulaZone(textareaVal,$textArea);	
			qaEditor.setCurrent($frame);
			$(this).data("live",true);
			$frame.data("formula",true);
		}
		$frame.find(".textArea_tips").trigger("click");
		editorCanvas.creatFormulaKeyboard($frame);

		// 设置formulaEditor样式
		setTimeout(function(){
			$frame.addClass("focusStyle");
		},0);
		$(".jOutline").remove();
		return false;		
	});

};
/*
 * 图片上传模块
 *
 **/
qaEditor.prototype.pictureModule = function() {
	var $frame = this.frame;
	var $picBtn = $frame.find(".picBtnWrp");
	var $textArea = $frame.find(".feTextArea");
	var $textArea2 = $frame.find(".textArea");
	var $picPre = $picBtn.find(".picPre");
	var $picDel = $picBtn.find(".picDel");
	var btnTips = this.settings.btnTips;
	var _self = this;
	
	
	$picBtn.click(function(){
		var that = $(this);
		if (!that.hasClass('lock')) {
			that.addClass('lock');
			$.when(
				$.get(qa_domain + "myinfo.json?" + new Date().getTime(),function(data){
					if(data.resultCode.code == 0){
						popPicUpload();
					}else if(data.resultCode.code = -7){
						var Login = new popLogin({
							submitSuccessCallback : function(){
								popPicUpload();
							}
						});
					}
				})
			).fail(function(){

			}).always(function(){
				that.removeClass('lock');
			});
		}		
		// return false;
	});
	
	function popPicUpload(){
		var imgsrc = $frame.data("pic")?$frame.data("pic"):"";
		var picUploadHTML = '<div id="uploadFlashWrp">'
								+'<div id="uploadFlash_overlay"></div>'
								+'<div id="uploadFlash">'
									+'<object id="picUpload" class="FalshObj" type="application/x-shockwave-flash" data="http:www.7wenta.com/resource/flash/uploadIcon.swf?20140825" width="520" height="380">'
										+'<param name="movie" value="http:www.7wenta.com/resource/flash/uploadIcon.swf?20140825">'
										+'<param name="quality" value="high">'
										+'<param name="menu" value="false">'
										+'<param name="allowScriptAccess" value="always">'
										+'<param name="wmode" value="transparent">'
										+'<param name="flashvars" value="imgField=file&amp;actionUrl='+_self.settings.uploadImgUrl+'&&amp;btnTips='+ btnTips +'&amp;imgsrc='+ imgsrc +'">'
									+'</object>'
								+'</div>'
							+'</div>';		
		var $picUploadHTML = $(picUploadHTML);
		$picUploadHTML.appendTo($("body"));
		$(".jOutline").remove();
		setTimeout(function(){
			$frame.removeClass("focusStyle");
		},0);
		$("#uploadFlash_overlay").css({
			height : $(document).height()
		});
		qaEditor.setCurrent($frame);
	}

	$picPre.hover(function(){
		$picDel.show();
	},function(){
		$picDel.hide();
	});
	$picDel.click(function(){
		$frame.find(".picPre").hide();
		$frame.removeData("pic");
		$picBtn.find(".btn-text").html("上传图片");
		return false;
	});
	
	Publisher.listen("uploadClose",function(url){
		$frame.removeData("current");
	});
	Publisher.listen("deleteCurrentImg",function(url){
		if ($frame.data("current")) {
			$picBtn.find(".picPre").hide();
			$frame.removeData("pic");
			$picBtn.find(".btn-text").html("上传图片");
		};
	});
	Publisher.listen("uploadSuccess",function(url){
		if ($frame.data("current")) {
			$picBtn.find(".btn-text").html("编辑图片");
			$picBtn.find(".uploadSuc_tips").show();
			setTimeout(function(){
				$(".uploadSuc_tips").hide();
			},2000);
			$frame.data("pic",url);
			$frame.removeData("current");
			$picPre.show();
			$picPre.find("img").attr("src",url);
		};
	});
};

/*
 * 文本编辑模块
 *
 **/
qaEditor.prototype.textModule = function(opts) {
	var $frame = this.frame;
	var $textArea = $frame.find(".feTextArea");
	var $textArea2 = $frame.find(".textArea");
	var $wordNumP = $frame.find(".wordNum");
	var $wordNum = $frame.find(".wordNum .val");
	var $maxLen = $frame.find(".wordNum .maxLen");
	var _self = this;	
	var lastFocusCell = null;

	function textValid(text){
		if (text && text != "" && text != $frame.find(".textArea_tips").text()) {
			return true;
		}
		return false;
	}

	function textFormulaOutput(){
		var txt = $textArea.data("latexData")?$textArea.data("latexData"):"";
		if (!textValid(txt)&&document.activeElement!=$("#textcell"+editorCanvas.outplane.list[editorCanvas.outplane.currentId]).find(".celltext")[0]) {
			// $textArea.find(".lastcell").trigger("mousedown");
			$frame.find(".textArea_tips").show();
			return;
		}else{
			var leftLength = _self.settings.maxLen - txt.length;
			if(leftLength < 0) {
				$wordNumP.trigger("wordOverflowTips", [1]);
			} else {
				$wordNumP.trigger("wordOverflowTips", [0]);
			}
		}
		setTimeout(function() {
			if(txt.length>0) $frame.find(".textArea_tips").hide();
			else if(txt.length==0 && !$frame.hasClass("focusStyle")) $frame.find(".textArea_tips").show();
		},0);
		$wordNum.text(txt.length);
	}

	// 公式文本
	$textArea.on("keyup", function(){
		setTimeout(function(){
			textFormulaOutput();
		},0);
	}).on("click",function(e){
		var parent = $textArea;
		var brother = $textArea.find(".editorTables");
		var _X = e.pageX, _Y = e.pageY;
		
		if (_X > parent.offset().left && _X < parent.offset().left + parent.outerWidth() && _Y > brother.offset().top + brother.outerHeight() && _Y < parent.offset().top + parent.outerHeight()) {
			 setTimeout(function(){
			$textArea.find(".celltext").last().trigger("mousedown").trigger("keydown").trigger("keyup").trigger("focus").trigger("click");
			 },0);
		}
	});
	
	$frame.on("blur",".celltext",function(e){
		setTimeout(function(){
			textFormulaOutput();
		},200);
		$frame.removeClass("focusStyle");
		lastFocusCell = $(this);
	}).bind("formulaOutPlaneUpdate", function(){
		setTimeout(function(){
			textFormulaOutput();
		},0);
	}).on("click",".celltext,canvas,.lastcell",function(e){
		// $(this).trigger("mousedown").trigger("click");
		$(this).trigger("mousedown");
		if (!$frame.data("current") || $(this).closest(".qaEditor").find("#formulaEditor").length==0) {
			$("#formulaEditor").remove();
		}
		qaEditor.setCurrent($frame);
		$frame.addClass("focusStyle");
		$frame.find(".textArea_tips").hide();
	}).on("focusCanvas", function(){
		$frame.addClass("focusStyle");
	});

	$frame.find(".textArea_tips").click(function(){
		$(this).hide();
		if (!lastFocusCell) {
			$textArea.find(".celltext").last().trigger("mousedown").trigger("keydown").trigger("focus").trigger("click");
		} else {
			lastFocusCell.trigger("focus").trigger("click");
		}
		$textArea2.trigger("focus");
		$frame.addClass("focusStyle");
		if (!$frame.data("current")) {
			$("#formulaEditor").remove();
		}
		qaEditor.setCurrent($frame);
	});
	$("body").on("click",function(e){
		var elem = $textArea;
		var _X = e.pageX, _Y = e.pageY, _offset = elem.offset(),
			_left = _offset.left, _top = _offset.top;
		
		if ($frame.data("formula")) {
			if (_X > _left && _X < _left + elem.outerWidth() && _Y > _top && _Y < _top + elem.outerHeight()) {
				$frame.addClass("focusStyle");
			}else{
				if ($frame.hasClass("focusStyle")) {
					$frame.removeClass("focusStyle");
					editorCanvas.onBlurEvent();
				}
			}
		};
	});

	// 普通文本
	$textArea2.on("keyup", function(){
		var $this = $(this);
		var txt = $.trim($this.val());
		if (textValid(txt)) {
			var leftLength = _self.settings.maxLen - txt.length;
		}
		if(_self.settings.maxLen < txt.length){
			$wordNumP.trigger("wordOverflowTips", [1]);
		}else{
			$wordNumP.trigger("wordOverflowTips", [0]);
		}
		$wordNum.text($.trim($this.val()).length);
		return false;
	}).change(function(){
		$(this).trigger("keyup");
	}).on("focus",function(){
		if($(this).val() == _self.settings.textCnt){
			$(this).val("");			
		}
		$frame.addClass("focusStyle");
		$frame.find(".textArea_tips").hide();
		if (editorCanvas != undefined) {
			editorCanvas.onBlurEvent();
		}
	}).on("blur",function(){
		var txt = $.trim($(this).val());
		if(!textValid(txt)){
			$frame.find(".textArea_tips").show();
//			 文本data设置
			$textArea2.removeData("text");
		}else{
			// 文本data设置
			$textArea2.data("text",txt);
		}
		$frame.removeClass("focusStyle");
		return false;
	});

	$wordNumP.bind("wordOverflowTips", function(e, showFlag){
		$target = $wordNumP;
		if(!$target) return;

		var step = 0;
		var maxStep = 3;
		var interVal = 300;
		var clear = function(){
			step = 0;
//			// $target.removeClass("overflowError");
			$target.addClass("overflowError");
			clearInterval($target.t);
			$target.removeClass("overflowErrorShowing");
		}

		if(!showFlag) {
			clear();
			$target.removeClass("overflowError");
			return;
		}
		if(!$target.hasClass("overflowErrorShowing")) {
			$target.addClass("overflowErrorShowing");
			$target.addClass("overflowError");
			$target.t = setInterval(function(){
				$target.toggleClass("overflowError");
				if(!$target.hasClass("overflowError")) { step++; }
				if(step >= maxStep) { clear(); }
			},interVal);
		}
	});

	if (_self.settings.sub) {
		$frame.find(".backFocusLayer").show();
	};
};

/*
 * 提交模块
 *
 **/
qaEditor.prototype.submitModule = function() {
	var $frame = this.frame;
	var $submitBtn = $frame.find(".submitBtn");
	var $textArea = $frame.find(".feTextArea");
	var $textArea2 = $frame.find(".textArea");
	var $cardBtn = $frame.find(".cardBtnWrp");
	var _self = this;

	function postData(){
		if (_self.controller()) {
			var _param = {
				content : $frame.data("text")?$frame.data("text"):null,
				imgUrl : $frame.data("pic")?$frame.data("pic"):null,
				grade : $frame.data("subject")?$frame.data("subject")["nj"]:null,
				course : $frame.data("subject")?$frame.data("subject")["km"]:null,
				qiuZhuUserIdStrings : $frame.data("ask")?$frame.data("ask"):null,
				adwardWendou : $frame.data("wendou")?$frame.data("wendou"):0
			};
			var param = $.param($.extend(_param, _self.settings.param),true);
			$.post(_self.settings.actionUrl,param,function(data){
				var result = data.result;
				$submitBtn.removeData("lock");

				function postSuccessCB(){
					_self.reset();
					_self.settings.submitCallback&&_self.settings.submitCallback(result.value);
					if(!window.hasLogin){
						getUserInfo(function(data){
							Publisher.fire("loginSuccess",data);
						},function(data){});
					}
				}

				if (_self.settings.type == 0) {
					if(result.resultCode.code == 0){
						postSuccessCB();
					}else if(result.resultCode.code == 1){
						showBox(result.resultCode.detail,postSuccessCB);
					}else if(result.resultCode.code == -7){
						if(_self.settings.submitLogin){
							var Login = new popLogin({
								submitSuccessCallback : function(){
									_self.settings.submitLogin(postData);
								}
							});
						}else{
							var Login = new popLogin({
								submitSuccessCallback : postData
							});
						}
						if(!$("#error .errorTxt").html()){
							$("#error .errorTxt").html('需要登录才能' + (_self.settings.sub?"提问":"回答") + '哦');
							$("#error").show();
						}
					}else if(result.resultCode.code == -90){
						showTips1("不能多次回答相同的内容哦");
					}/*else if(result.resultCode.code == -92){
						In("wtBox_js",function(){
							$.wtBox({
								cnt : "10分钟之内只能提问三次，先去问答中心答答题吧",
								sure : function($box){
									window.open("http://www.7wenta.com/subject/g0.html");
								},
								sureTxt : "去看看",
								cancelTxt : ""
							});
						});
					}*/else if(result.resultCode.code == -91){
						In("wtBox_js",function(){
							$.wtBox({
								cnt : "这道问题你已经提问过了，可以去“我的提问”查看一下",
								sure : function($box){
									window.open("http://www.7wenta.com/my/question");
								},
								sureTxt : "去看看",
								cancelTxt : ""
							});
						});
					}else if(result.resultCode.code == -5){
						lackWendou();
					}else{					
						In("wtBox_js",function(){
							$.wtBox({
								cnt : result.resultCode.detail,
								sure : function($box){
									_self.settings.failCallback&&_self.settings.failCallback(result.resultCode.code);
									$box.remove();
								},
								cancelTxt : ""
							});
						});
					}
				};				

				//向老师提问没有提问卡
				if (_self.settings.type == 1) {
					if(result.resultCode.code == 0){
						_self.reset();
						_self.settings.submitCallback&&_self.settings.submitCallback(result.value);
						if(!window.hasLogin){
							getUserInfo(function(data){
								Publisher.fire("loginSuccess",data);
							},function(data){});
						}
					}else if(result.resultCode.code == -7){
						var Login = new popLogin({
							submitSuccessCallback : function(){$submitBtn.trigger("click");}
						});
						if(!$("#error .errorTxt").html()){
							$("#error .errorTxt").html('需要登录才能' + (_self.settings.sub?"提问":"回答") + '哦');
							$("#error").show();
						}
					}else if(result.resultCode.code == -6){
						showVipBuyBox();
					}else{
						In("wtBox_js",function(){
							$.wtBox({
								cnt : result.resultCode.detail,
								sureTxt: "确定",
								cancelTxt: "",
								sure : function($box){
									$box.remove();
								},
								cancelTxt : ""
							});
						});
					}
				};
				$frame.removeData("text");
			},"json");
		}else{
			$submitBtn.removeData("lock");
		}
	}
	function checkJingjie(){
		if (_self.controller()) {
			var param = {
				kw : $frame.data("text")?$frame.data("text"):null,
				grade : $frame.data("subject")?$frame.data("subject")["nj"]:null,
				course : $frame.data("subject")?$frame.data("subject")["km"]:null
			};
			var actionUrl = qa_domain + 'search/jingjie.json?kw=' + encodeURIComponent(param.kw) + '&grade=' + param.grade + '&subject=' + param.course;
			$.post(actionUrl,{},function(data){
				if (data.result.resultCode.code == 0) {
					var dataCnt = data.result.value.content;
					var start = dataCnt.indexOf("<img"),end;
					while(start >= 0){
						dataCnt = dataCnt.substr(0,start);
						end = dataCnt.indexOf(">") + 1;
						dataCnt = dataCnt.substr(end);
						start = dataCnt.indexOf("<img");
					}

					In("wtBox_js",function(){
						$.wtBox({
							iclass : 'wtBox_jing',
							title : '问他小提示',
							cnt : '<div class="jingCnt">\
									<div class="jing_hd">小问帮你找到了一个参考题目哦～</div>\
									<div class="jing_bd">'+ dataCnt +'</div>\
								</div>',
							sureTxt: "看参考题目",
							cancelTxt: "继续提问",
							after : function($box){
								editorCanvas.showfomular($box.find(".jing_bd"));
							},
							sure : function($box){
								window.open(qa_domain + 'topic/'+ data.result.value.qId +'.html');
							},
							cancel : function($box){
								postData();
							}
						});
					});
				}else{
					postData();
				}							
			});
		}else{
			$submitBtn.removeData("lock");
		}
	}
	$submitBtn.on("click",function(){	
		var that = $(this);
		if (!that.data("lock")) {
			that.data("lock",true);
			editorCanvas.removeKeyboard();
			editorCanvas.outplane.reRenderAll();
			if (_self.settings.sub){
				checkJingjie();
				_self.settings.submitClick&&_self.settings.submitClick();
			}else{
				_self.settings.submitClick&&_self.settings.submitClick.call(_self.settings);
				if(_self.settings.stopSubmit){
					_self.settings.stopSubmit = false;
					that.data("lock",false);
					return false;
				}
				postData();
			}
		};
		$("#formulaEditor").remove();
		$frame.removeClass("focusStyle");
		return false;
	});
};

qaEditor.prototype.controller = function() {
	var $frame = this.frame;
	var $textArea = $frame.find(".feTextArea");
	var $textArea2 = $frame.find(".textArea");
	var $picBtn = this.frame.find(".picBtnWrp");
	var $subBtn = $frame.find(".subBtnWrp");
	var $backFocusLayer = $frame.find(".backFocusLayer");
	var $wordNum = $frame.find(".wordNum");
	var $wordNumVal = $frame.find(".wordNum .val");
	var $maxLen = $frame.find(".wordNum .maxLen");
	var _self = this;

	$frame.data("text",editorCanvas.getFormulaTableValue($frame,true));

	$("body").on("mouseenter",".subErrorTip,.txtErrorTip",function(){
		$(this).remove();
	});

	if(parseInt($wordNumVal.text()) > parseInt($maxLen.text())) {
		$wordNum.trigger("wordOverflowTips", [1]);
		return false;
	}

	if (!this.settings.sub) {
		if (!$frame.data("text") && !$frame.data("pic")) {
			$frame.find(".txtErrorTip").remove();
			In('jOutline_js',function(){
				($frame.data("formula")?$textArea:$textArea2).jOutline({
					"borderColor":"#ff6666",event:"click",cnt:_self.settings.errorTip,iclass:"oSyle_1",
					callback : function(){
						$frame.find(".textArea_tips").trigger("click");
					}
				});
			});
			return false;
		}
		return true;
	}else{
		if (!$frame.data("subject")) {
			$frame.find(".subErrorTip").remove();
			In('jOutline_js',function(){
				$subBtn.jOutline({"borderColor":"#ff6666",event:"hover",cnt:"你还没有选择年级/学科哦~",iclass:"oSyle_2"});
			});
			return false;
		}
		if (!$frame.data("text") && !$frame.data("pic")) {
			$frame.find(".txtErrorTip").remove();
			In('jOutline_js',function(){
				$backFocusLayer.jOutline({
					"borderColor":"#ff6666",event:"click",cnt:_self.settings.errorTip,iclass:"oSyle_1",
					parent : $frame,
					left : -1,
					top : 28,
					callback : function(){
						$frame.find(".textArea_tips").trigger("click");
					}
				});
			});
			return false;
		}
		return true;
	}	
};

/*
 * 问学霸模块
 *
 **/
qaEditor.prototype.askModule = function() {
	var $frame = this.frame;
	var $askBtn = $frame.find(".askBtnWrp");
	var $askList = $frame.find(".askList");
	var _self = this;

	$frame.data("ask",[]);
	$askBtn.show();

	$askList.on("click",".askClose",function(){
		var that = $(this);
		var $askItem = that.closest(".askItem");
		var userId = $askItem.data("userid");

		$frame.data("ask",$.grep($frame.data("ask"),function(value,index){
			return value == userId;
		},true));
		$askItem.remove();
		if ($frame.data("ask").length == 0) {
			$frame.removeClass("minHeightModule");
			$askList.hide();
		};
		return false;
	});

	In("addFollowing_js",function(){
		$askBtn.addFollowing({
	        addUser : function(userId,name){
	            var askItem = '<li class="askItem pr" data-userid="'+ userId +'"><a href="###" class="askLk">@'+ name +'</a><a href="###" class="askClose pa"></a></li>';
				if($frame.data("ask").length >= 3) {
					In("wtTips_js",function(){
						wtTips({
							content : "一次只能问3个人，不能太贪心哦~",
							showPos : 2,
							$refer : $askBtn,
							appear : function(){
								$(this).find(".tips_boxCnt").css({'background':'none','border':'none'});
								$(this).find(".tips_bg").css({background:'#FFF2DF',color:'#c96',padding:'0px','font-size':'12px','text-align':'center','line-height':'22px'});
							}
						});
					});
				}else if($.inArray(userId,$frame.data("ask")) == -1){
					$askList.show().append(askItem);
					$frame.data("ask").push(userId);
					$frame.addClass("minHeightModule");
				};
	        },
	        refreshData : function(){
	        	this.cancelIds = $frame.data("ask");
	        	this.grade = $frame.data("subject")?$frame.data("subject")["nj"]:null;
				this.course = $frame.data("subject")?$frame.data("subject")["km"]:null;
	        },
	        grade : $frame.data("subject")?$frame.data("subject")["nj"]:null,
			course : $frame.data("subject")?$frame.data("subject")["km"]:null
	    });
	});
}

/*
 * 提问卡模块
 *
 **/
qaEditor.prototype.cardModule = function() {
	var $frame = this.frame;
	var $cardBtn = $frame.find(".cardBtnWrp");
	var $submitBtn = $frame.find(".submitBtn");
	var _self = this;

	$frame.data("ask",[]);
	$cardBtn.show();
	
	function getTiwenKa(){
		var actionUrl = qa_domain + 'queryTiWenKa.json';
		$.post(actionUrl,{},function(data){
			if (data.result.resultCode.code == 0) {
				$cardBtn.find(".val").html(data.result.value.tiWenKaCount);
				// if (!data.result.value.isOver) {
					$cardBtn.bind("mouseenter",function(){
						var $t = $(this);
						if ($cardBtn.find(".val").html() == 0) {
							showBottomTips("想获得更多黄金提问卡吗？",$t);
						}else{
							showBottomTips("使用提问卡可以向问他老师发问哦~",$t);
						}
					}).bind("click",function(){
						showVipBuyBox();
					});
					if (_self.settings.type == 1) {
						$submitBtn.on("mouseenter",function(){
							var $t = $(this);
							showBottomTips("每次问老师要用1张提问卡，向老师提问，快速解决作业难题！",$t);
						});
					};
				// };
			};
		});
	}
	if (window.hasLogin) {
		getTiwenKa();
	};
	
	Publisher.listen("loginSuccess",getTiwenKa);
}
qaEditor.prototype.ExtSwitchModule = function() {
	var $frame = this.frame;
	var _self = this;
	var $submitBtn = $frame.find(".submitBtn");

	$frame.find(".swtBtn").click(function(){
		if (_self.settings.type == 0) {
			$(".sEditorBoxSelect .switchBtn_2").click();
		}else if (_self.settings.type == 1) {
			$(".sEditorBoxSelect .switchBtn_1").click();
		}
	});

	if (_self.settings.type == 0) {
		$frame.find(".swtBtn").on("mouseenter",function(){
			var $t = $(this);
			showBottomTips("使用提问卡问老师，解题神速，质量更高！~",$t);
		});
	};
}

/*
 * 问豆模块
 *
 **/
qaEditor.prototype.wendouModule = function() {
	var $frame = this.frame;
	var $reward = $frame.find(".rewardWrp");
	var _self = this;
	var url = qa_domain + "myinfo.json?" + new Date().getTime();
	
	$.get(url,function(data){
		if(data.resultCode.code == 0){
			init(data.value.quser.wendou);
		}else if(data.resultCode.code = -7){
			Publisher.listen("loginSuccess",function(data){
				var selWD = parseInt($reward.find(".rw_num").html()),
					total = data.value.quser.wendou;
				$reward.empty();
				init(total,selWD);
			});
			init(-1);
		}
	});
	
	function init(wendou, selWendou){
		selWendou = selWendou || 0;
		var reWardHTML = '<div class="reward clearfix">\
							<span class="l">悬赏</span>\
							<div class="rw_cnt l">\
								<div class="clearfix">\
									<span class="rw_num l">'+selWendou+'</span>\
									<span class="rw_arr r"></span>\
								</div>\
								<ul class="rw_sel pa hide">\
									<li><a href="###" class="rw_it rw_it_true">0</a></li>\
									<li><a href="###" class="rw_it rw_it_'+(wendou>=5 || wendou<0?'true':'false')+'">5</a></li>\
									<li><a href="###" class="rw_it rw_it_'+(wendou>=10 || wendou<0?'true':'false')+'">10</a></li>\
									<li><a href="###" class="rw_it rw_it_'+(wendou>=20 || wendou<0?'true':'false')+'">20</a></li>\
									<li><a href="###" class="rw_it rw_it_'+(wendou>=30 || wendou<0?'true':'false')+'">30</a></li>\
									<li><a href="###" class="rw_it rw_it_'+(wendou>=50 || wendou<0?'true':'false')+'">50</a></li>\
								</ul>\
							</div>'+ (wendou>=0?'<span class="rw_total l q_wendou">'+wendou+'</span>':'') +
					   '</div>';
		$reward.append(reWardHTML);
		$frame.data("wendou",selWendou);
		$frame.find(".rw_cnt").mouseenter(function(){
			var $t = $(this);
			if(!$frame.find(".rw_sel:visible").length){
				var content = "采纳答案后，小问会返还你10%的问豆<br/>80%的问豆将会作为题目悬赏";
				showBottomTips(content,$t,function(){
					var $this = $(this);
					$t.click(function(){
						$this.remove();
					});
				});
			}
		}).click(function(){
			if($frame.find(".rw_arr_up").length){
				closeReward();
			}else{
				$frame.find(".rw_sel").show();
				$(this).find(".rw_arr").addClass("rw_arr_up");
			}
			return false;
		});
		$("body").click(function(){
			closeReward();
		});
		$("body a").bind("click",function(){
			closeReward();
		});
		$frame.find(".rw_it_true").click(function(){
			var wendou = +($(this).html());
			$frame.find(".rw_num").html(wendou);
			$frame.data("wendou",wendou);
			closeReward();
			return false;
		});
		function closeReward(){
			$frame.find(".rw_sel").hide();
			$frame.find(".rw_arr_up").removeClass("rw_arr_up");
		}
		$frame.find(".rw_it_false").click(function(){return false;});
	}	
}

qaEditor.prototype.reset = function() {
	var $frame = this.frame;
	var $textArea = $frame.find(".feTextArea");
	var $textArea2 = $frame.find(".textArea");
	var $picBtn = this.frame.find(".picBtnWrp");
	var $subBtn = $frame.find(".subBtnWrp");
	var $fomBtn = $frame.find(".fomBtnWrp");
	var $forbidCheatTips = $frame.find(".forbidCheap_tips");

	$frame.removeData("text");
	$frame.removeData("pic");
	$frame.removeData("subject");
	$frame.removeData("formula");
	$fomBtn.removeData("live");

	$textArea.empty();
	$textArea2.show().val("").trigger("keyup").trigger("blur");
	$picBtn.find(".btn-text").text("上传图片");
	$picBtn.find(".picPre").hide();
	$subBtn.find(".btn-text").text("年级/学科");
	$forbidCheatTips.remove();
};

qaEditor.prototype.init = function() {
	if (this.settings.sub) {
		if (this.settings.type == 0) {
			this.subjectModule();
			this.askModule();
			this.wendouModule();
		}else if (this.settings.type == 1) {
			this.cardModule();
			this.subjectModule();
		}
	}
	
	this.textModule();
	this.submitModule();
	this.pictureModule();
	this.formulaModule();
	this.ExtSwitchModule();
	this.frame.appendTo(this.settings.parent);
};

qaEditor.setCurrent = function(elem){
	$(".qaEditor").removeData("current");
	elem.data("current",true);
}

/*
 * 图片上传Flash接口
 *
 */
function closeUploadFlash(){
	$("#uploadFlashWrp").remove();
	Publisher.fire("uploadClose");
}

function showFlash(){
	if($("#pic_uploadFlash").length){
		$("#picUpload").css({height:"410px",width:"522px"});
		return true;
	}else{
		return false;
	}
}

function successUploadClose(data){
	if(data.resultCode.code == 0){
		Publisher.fire("uploadSuccess",data.value.picUrl);
		$("#uploadFlashWrp").remove();
	}else{
		alert(data.resultCode.datail);
	}
}
function failUploadClose(){

}
function deleteCurrentImg(){
	Publisher.fire("deleteCurrentImg",1);
}
function openAppLink(){
	window.open("http://www.7wenta.com/jst/app");
}

function init_sEditorBox(){
	var sEditorBoxHTML = '<div class="sEditorBox">\
								<div class="searchForm sebForm clearfix pr" data-index="0">\
									<div class="sEB_hd"></div>\
									<div class="sEB_bd">\
										<div id="search_form" class="latex-outer clearfix pr">\
											<div class="feSearchText latex-table l" minHeight="40" maxHeight="200" search="true"></div>\
											<input class="search_text latex-textarea pa cS"/>\
											<div class="search_tips latex-tip feTip pa">有作业问题？来找找答案吧！</div>\
											<a href="###" class="formula_btn latex-clickBtn pa"></a>\
											<a href="###" class="search_btn pa"></a>\
										</div>\
									</div>\
									<div class="sEB_ft"></div>\
								</div>\
								<div class="editorForm sebForm hide pr" data-index="1">\
									<div class="sEB_hd"></div>\
									<div class="sEB_bd">\
										<div class="editor_form clearfix pr"></div>\
									</div>\
									<div class="sEB_ft"></div>\
								</div>\
								<div class="editorForm_vip sebForm hide pr" data-index="2">\
									<div class="sEB_hd"></div>\
									<div class="sEB_bd">\
										<div class="editor_form clearfix pr"></div>\
									</div>\
									<div class="sEB_ft"></div>\
								</div>\
								<div class="paperForm sebForm hide clearfix pr" data-index="3">\
									<div class="sEB_hd"></div>\
									<div class="sEB_bd">\
										<div id="paper_form" class="latex-outer clearfix pr">\
											<input class="paper_text latex-textarea pa cS"/>\
											<div class="paper_tips latex-tip feTip pa">请输入你想找的试卷</div>\
											<a href="###" class="paper_del_btn pa"></a>\
											<a href="###" class="paper_btn pa"></a>\
										</div>\
									</div>\
									<div class="sEB_ft"></div>\
								</div>\
								<em class="cArrow"></em>\
							</div>';
	$('.sEditorBoxWrp').append(sEditorBoxHTML);
}
$(function(){
	init_sEditorBox();

	/*普通提问*/
	function initQaEditor(){
		if ($(".editorForm").length > 0 && $(".editorForm .editor_form .qaEditor").length == 0) {
			var qaEditor1 = new qaEditor({
				parent : $(".editorForm .editor_form"),
				iclass : "mqaEditor",
				submitCallback : function(value){
					var d = new Date();
					if (d.getHours() >= 9 && d.getHours() < 23) {
						window.location.href = qa_domain + "question/"+value.wenTiId+".html#normal";
					}else{
						window.location.href = qa_domain + "question/"+value.wenTiId+".html#sleep";
					}
				}
			});
		};
	}

	/*问老师*/
	$(".sEditorBoxSelect .swtBtn_tc").addClass("pr").append('<em class="AskTcTips" style="display:block;z-index:100;cursor:default;width:15px;height:15px;background:url(../qa/style/img_s/askTcIcon.png) 0px 0px no-repeat;position:absolute;right:'+ (-16) +'px;top:'+ (-13) +'px;"></em>');
	function initVipQaEditor(){
		if ($(".editorForm_vip .qaEditor").length <= 0 && typeof qaEditor != 'undefined' && $(".editorForm_vip .editor_form .qaEditor").length == 0) {
			var qaEditor1 = new qaEditor({
				parent : $(".editorForm_vip .editor_form"),
				actionUrl : qa_domain + "addWenTi2Teacher.json",
				type : 1,
				iclass : "mqaEditor",
				textCnt : "一次只能提问一道问题哦。目前老师暂时不接受英语阅读、完形填空及语文阅读的题目指导。",
				submitCallback : function(value){
					var d = new Date();
					if (d.getHours() >= 9 && d.getHours() < 23) {
						window.location.href = qa_domain + "question2Teacher/"+value.wenTiId+".html";
					}else{
						window.location.href = qa_domain + "question2Teacher/"+value.wenTiId+".html#sleep";
					}
				},
				submitClick : function(){
					var d = new Date();
					var newYearime = {
						st : new Date("Thu Jan 30 2014 00:00:00 GMT+0800 (中国标准时间)"),
						end : new Date("Tue Feb 04 2014 00:00:00 GMT+0800 (中国标准时间)")
					}
					if (d.getTime() > newYearime.st.getTime() && d.getTime() < newYearime.end.getTime()) {
						showBox('Hi,老师们在过新年呢，2月4日开始老师们将回来为你解答问题~');
						return false;
					}
				}
			});
		};
	}

	var preIndex = curIndex = 0;

	$(".sEditorBoxSelect").data("caLeftObj",{"0":30,"1":90,"2":146,"3":206});
	$(".sEditorBoxSelect .switchBtn").click(function(){
		var that = $(this);
		var $sebForm = $(".sEditorBox .sebForm");
		var $searchForm = $(".searchForm");
		var $editorForm = $(".editorForm");
		var $editorForm_vip = $(".editorForm_vip");
		var $paperForm = $(".paperForm");
		var $cArrow = $(".sEditorBox").find(".cArrow");

		preIndex = curIndex;
		curIndex = $(".sEditorBoxSelect .switchBtn").index(that);
		var preSebForm,curSebForm;

		$(".sEditorBox .sebForm").each(function(){
			var that = $(this);
			var index = that.data("index");
			if (index == preIndex) {
				preSebForm = that;				
			}else if (index == curIndex) {
				curSebForm = that;
			};
		});

		function copyValueToBox(){
			var frmReg = /<frm>.*?<\/frm>/g;
			var preValue =decodeURIComponent(editorCanvas.getFormulaTableValue(preSebForm));
			
			if (preValue != "") {
				curSebForm.find(".latex-tip").hide();
				if (preSebForm.find(".latex-outer").data("formula") && !curSebForm.hasClass("paperForm")) {
					curSebForm.find(".latex-table").empty().show();
					curSebForm.find(".latex-textarea").hide();
					curSebForm.find(".qaEditor").data("formula", true).data("live", true);
					editorCanvas.activeFormulaZone(preValue,curSebForm.find(".latex-table"));					
				}else{
					curSebForm.find(".latex-textarea").val(preValue).show().trigger("click").trigger("focus");
					curSebForm.find(".latex-table").hide();
				}
			};			
		}
		function copyDataToBox(){
			var curQaEditor = curSebForm.find(".qaEditor");
			var preQaEditor = preSebForm.find(".qaEditor");

			curQaEditor.data("text",preQaEditor.data("text"));
			
			curQaEditor.data("formula",preQaEditor.data("formula"));
			curQaEditor.data("live",preQaEditor.data("live"));
			qaEditor.setCurrent(curQaEditor);

			curQaEditor.data("subject",preQaEditor.data("subject"));
			curQaEditor.find(".subBtnWrp .btn-text").html(preSebForm.find(".subBtnWrp .btn-text").html());

			curQaEditor.find(".wordNum .val").html(preSebForm.find(".wordNum .val").html());

			curQaEditor.data("pic",preQaEditor.data("pic"));
			if (preQaEditor.data("pic")) {
				var curPicBtn = curQaEditor.find(".picBtnWrp");
				var prePicBtn = preQaEditor.find(".picBtnWrp");
				curPicBtn.find(".btn-text").html(prePicBtn.find(".btn-text").html());				
				curPicBtn.find(".picPre").show();
				curPicBtn.find("img").attr("src",preQaEditor.data("pic"));
			};
		}

		if (!that.hasClass("active")) {
			$(".switchBtn").removeClass('active');
			$cArrow.removeClass("vipArrow");
			that.addClass('active');
			$sebForm.hide();
			curSebForm.show();
			$cArrow.animate({left:$(".sEditorBoxSelect").data("caLeftObj")[curIndex]},200);

			if(that.hasClass('switchBtn_1')){
				initQaEditor();
			}

			if(that.hasClass('switchBtn_2')){
				initVipQaEditor();
				$cArrow.addClass("vipArrow");
			}

			if((preIndex == 1 && curIndex == 2) || (preIndex == 2 && curIndex == 1)){
				copyDataToBox();
			}
			$("#search_form").data("formula",preSebForm.find(".qaEditor").data("formula"));
			$("#paper_form").data("formula",preSebForm.find(".qaEditor").data("formula"));

			copyValueToBox();
		};

		// 切换的时候删除键盘
		$("#formulaEditor").remove();
		
		return false;
	});

	// 试卷园地默认选中试卷搜索框，要放在click监听后面？
	if (window.location.href.indexOf('/shijuan/') != -1) {
		$(".sEditorBoxSelect .switchBtn_3").click();
	}

	/*搜题目*/
	(function initSearchTablet(){
		function openSearchPage(){
			var txt = editorCanvas.getFormulaTableValue($(".sEditorBox .searchForm"));
			txt = encodeURIComponent(txt);
			if ($.trim(txt) != "") {
				var href = 'http://www.7wenta.com/search/s?kw=' + txt;
				if (window.location.href.indexOf("/search/s") == -1) {
					window.open(href);
				}else{
					window.location.href = href;
				}
			};
		}

		/*公式搜索*/
		$(".searchForm .formula_btn").click(function(){
			if (!$(this).data("live") && !$("#search_form").data("formula")) {
				var searchVal = $(".search_text").val();
				editorCanvas.activeFormulaZone(searchVal,$(".feSearchText"));
				$("#search_form").data("formula",true);
				$(".search_text").remove();
				$(this).data("live",true);
			}

			if ($(".searchForm").find('#formulaEditor').length > 0) {
				$("#formulaEditor").toggle();
			}else{
				editorCanvas.creatFormulaKeyboard($(".searchForm"));
			}
			$(".search_tips").trigger("click");
			return false;
		});
		$(".searchForm").on("click","input,.lastcell,canvas",function(){
			if ($(".searchForm").find('#formulaEditor').length == 0) {
				$("#formulaEditor").remove();
			}
		});
		$("body").on("blur",".feSearchText .celltext",function(){
			setTimeout(function(){
				var txt = editorCanvas.getFormulaOutput($(".feSearchText"));
				if ($.trim(txt) == ""&&document.activeElement!=$("#textcell"+editorCanvas.outplane.list[editorCanvas.outplane.currentId]).find(".celltext")[0]) {
					$(".search_tips").show();
				}
			},0);
		});
		//搜索回车提交
		$(".searchForm .editortablerow > td").live("keyup",(function(event){
			if(event.keyCode == 13){
				$(".search_btn").trigger("click");
			}
		}));
		$(".searchForm input").live("focus",function(){
			$(".search_tips").hide();
		});

		/*普通搜索*/
		$(".search_tips").click(function(e){
			$(this).hide();
			$(".search_text").val("").trigger("focus");
			$(".feSearchText").find(".lastcell").trigger("click");
		});
		$(".search_text").bind("blur",function(){
			var txt = $.trim($(this).val());
			if (txt == "" || txt == $(".search_tips").text()) {
				$(".search_tips").show();
			}
		}).on("keyup",function(e){
			if (e.keyCode == 13) {
				openSearchPage();
			};
		}).on("focus",function(e){
			$(".search_tips").hide();
		});
		$(".search_btn").click(function(){
			openSearchPage();
			return false;
		});
	})();

	/*搜试卷*/
	(function initPaperTablet(){
		function openPaperSearchPage(){
			var txt = getPaperValue();
			if ($.trim(txt) != "") {
				var href = 'http://www.7wenta.com/shijuan/e2/?kw=' + txt;
				if (window.location.href.indexOf("/shijuan/") == -1) {
					window.open(href);
				}else{
					window.location.search = "?kw=" + txt;
					/*setTimeout(function(){
						$("#paginationDiv a").eq(0).click();
					},0);*/
				}
			};
		}
		function getPaperValue(){
			var searchVal = $(".paper_text").val();
			return encodeURIComponent(searchVal.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">"));
		}

		/*普通搜索*/
		$(".paper_tips").click(function(){
			$(this).hide();
			$(".paper_text").val("").trigger("focus");
		});
		$(".paper_text").bind("blur",function(){
			var txt = $.trim($(this).val());
			if (txt == "" || txt == $(".paper_tips").text()) {
				$(".paper_tips").show();
			}
		}).on("keyup",function(e){
			if (e.keyCode == 13) {
				openPaperSearchPage();
			}
			var txt = $.trim($(this).val());
			if (txt == "" || txt == $(".paper_tips").text()) {
				$(".paper_del_btn").hide();
				if (txt == "" && e.keyCode == 8) {
					window.location.search = "";
				}
			}else{
				$(".paper_del_btn").show();
			}
		}).on("change",function(e){
			var txt = $.trim($(this).val());
			if (txt == "" || txt == $(".paper_tips").text()) {
				$(".paper_del_btn").hide();
			}else{
				$(".paper_del_btn").show();
			}
		}).on("focus",function(e){
			$(".paper_tips").hide();
		});
		$(".paper_del_btn").click(function(){
			$(".paper_text").val("").focus();
			$(this).hide();
			return false;
		});
		$(".paper_btn").click(function(){
			openPaperSearchPage();
			return false;
		});
	})();
});

//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外  
function banBackSpace(e){     
    var ev = e || window.event;//获取event对象     
    var obj = ev.target || ev.srcElement;//获取事件源     
      
    var t = obj.type || obj.getAttribute('type');//获取事件源类型    
      
    //获取作为判断条件的事件类型  
    var vReadOnly = obj.getAttribute('readonly');  
    var vEnabled = obj.getAttribute('enabled');  
    //处理null值情况  
    vReadOnly = (vReadOnly == null) ? false : vReadOnly;  
    vEnabled = (vEnabled == null) ? true : vEnabled;  
      
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，  
    //并且readonly属性为true或enabled属性为false的，则退格键失效  
    var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")   
                && (vReadOnly==true || vEnabled!=true))?true:false;  
     
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效  
    var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")  
                ?true:false;          
      
    //判断  
    if(flag2){  
        return false;  
    }  
    if(flag1){     
        return false;     
    }     
}  

function showVipBuyBox(){
	var content = '<p>问老师功能即将取消，有问题请向学霸提问噢。<br/>下载<a href="'+qa_domain+'jst/app" target="_blank" style="color:#096;font-weight:bold;text-decoration:underline;">问他手机版</a>，拍照提问更容易！<p><div class="clearfix"style="width:430px;height:160px;margin:30px auto 0;"><div class="l" style="width:200px;padding:0 20px;"><a href="'+
		qa_domain+'app_android" target="blank" style="width:200px;height:62px;display:block;margin-bottom:38px;background:url('+static_domain+'qa/style/img_d/ph_dl.jpg) 0 0" onmouseover="style.backgroundPositionY = \'-62px\'" onmouseout="style.backgroundPositionY = \'0px\'"></a><a href="'+
		'https://itunes.apple.com/us/app/wen-ta/id728374764" target="blank" style="width:200px;height:62px;display:block;background:url('+static_domain+'qa/style/img_d/ph_dl.jpg) 0 -124px" onmouseover="style.backgroundPositionY = \'-186px\'" onmouseout="style.backgroundPositionY = \'-124px\'"></a></div><div class="l" style="width:190px"><img src="'+
		static_domain+'qa/style/img_s/ph_code_20131121.png" alt="二维码" style="width:138px;height:138px;margin:0 auto;"><p style="font-family:微软雅黑;color:#333;text-align:center;margin-top:6px;">使用手机QQ、微博扫描下载</p></div></div>';
	In("wtBox_js",function(){
		$.wtBox({
			iclass:'wtBox_twc',
			cnt : content,
			sureTxt : '',
			cancelTxt : '',
			sure : function($box){$box.remove();},
			close : function($box){$box.remove();}
		});
	});
}
  
//禁止后退键 作用于Firefox、Opera  
document.onkeypress=banBackSpace;  
//禁止后退键  作用于IE、Chrome  
document.onkeydown=banBackSpace; 

editorCanvas.acitveInsertButton = function(){
	$("#latex-insert").click(function(){			
		if (!$(this).data("live")) {
			editorCanvas.changeTextAreaToTable($("#fezone"),300,200)
			var searchVal = $("#latex-textarea").val();
			editorCanvas.activeFormulaZone(searchVal,$("#latex-table"));
			$("#latex-textarea").hide();
			$("#latex-outer").data("formula",true);				
			$(this).data("live",true);
		}
		if ($("#formulaEditor").length > 0) {
			$("#formulaEditor").toggle();
		}else{
			editorCanvas.creatFormulaKeyboard($("#latex-outer"));
		}
		$("#latex-table").find(".lastcell").trigger("click");
		return false;
	});
}
editorCanvas.changeTextAreaToTable = function(elem,width,height){
	var latexFormulaEditorHTMl = '<div class="latex-zone" id="latex-outer" style="position:relative;">\
									<div class="latex-zone" id="latex-table" style="position:absolute;left:0px;top:0px;overflow:auto;"></div>\
									<textarea class="latex-zone" id="latex-textarea" style="position:absolute;left:0px;top:0px;"></textarea>\
								</div>';
	elem.append(latexFormulaEditorHTMl);
	$(".latex-zone").css({
		width : width,
		height : height
	});
}
// hasEntity为true，取到有实体符号的值，提交的给后端的时候一定要设成true
editorCanvas.getFormulaTableValue = function(elem,hasEntity){
	var searchVal = "";
	var target = elem;
	if (!elem.hasClass("latex-outer")) {
		target = elem.find(".latex-outer");
	}
	if (target.data("formula")) {
		searchVal = editorCanvas.getFormulaOutput(target.find(".latex-table"));
	}else{
		searchVal = target.find(".latex-textarea").val();
	}
	return	hasEntity?searchVal:searchVal.replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">");
}

editorCanvas.creatFormulaKeyboard = function(elem){
	In('keyboard_js',function(){
		editorCanvas.creatFormulaKeyboard(elem);
	});
}