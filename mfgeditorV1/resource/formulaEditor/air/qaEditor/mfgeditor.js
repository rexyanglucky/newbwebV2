In.add('addFollowing_js', { path: static_domain + 'resource/formulaEditor/air/qaEditor/jquery.addFollowing.js' + buildVersion, type: 'js', charset: 'utf-8' });
In.add('jOutline_js', { path: static_domain + 'resource/common/script/plugin/jquery.joutline.js' + buildVersion, type: 'js', charset: 'utf-8' });
In.add('keyboard_css', { path: static_domain + 'resource/formulaEditor/air/feEditor/mfgEditor.css' + buildVersion, type: 'css', charset: 'utf-8' });
In.add('keyboard_js', { path: static_domain + 'resource/formulaEditor/air/qaEditor/mfgkeyboard.js' + buildVersion, type: 'js', charset: 'utf-8', rely: ['keyboard_css'] });

/*
 * 提问编辑框控件
 *
 **/
var mfgEditor = function (opts) {
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
        textCnt : "请输入试题",
        btnTips: 1, //上传图片按钮下面的提示语，1为手机提示语，2为大学生系统提示语
        submitCallback : function(){},
        submitClick : function(){},
        submitLogin : null,
        failCallback: null
    };
    
    this.settings = $.extend({}, _defaults, opts);
var _frame = '<div class="qaEditor latex-outer pr '+ this.settings.iclass +'">\
                    <div class="backFocusLayer pa hide"></div>\
                    <div class="feTextArea latex-table pa"  ></div>\
                    <textarea class="textArea latex-textarea cS pa"></textarea>\
                    <div class="textArea_tips latex-tip feTip pa">'+ this.settings.textCnt +'</div>\
                    <div class="fomBtnWrp pa latex-clickBtn">\
                        <a href="###" hidefocus class="fomBtn qa-btn clearfix">\
                            <span class="btn-icon qsp l"></span>\
                            <span class="btn-text l">公式</span>\
                            <span class="btn-arrow qsp l"></span>\
                        </a>\
                    </div>\
                </div>';
    this.frame = $(_frame);
    this.init();
}

mfgEditor.prototype.reset = function () {
   
};

mfgEditor.prototype.init = function () {
    this.textModule();
    this.formulaModule();
    this.frame.appendTo(this.settings.parent);
};
/*
 * 文本编辑模块
 *
 **/
mfgEditor.prototype.textModule = function(opts) {
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
         // setTimeout(function(){
         $textArea.find(".celltext").last().trigger("mousedown").trigger("keydown").trigger("keyup").trigger("focus").trigger("click");
         // },0);
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
     // if (!$frame.data("current") || $(this).closest(".qaEditor").find("#formulaEditor").length==0) {
     //     $("#formulaEditor").remove();
     // }
      if ($(".keyboard_wrap").find('#formulaEditor').length == 0) {
        $(".keyboard_wrap").remove();
      }
     mfgEditor.setCurrent($frame);
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
     // if (!$frame.data("current")) {
     //     $("#formulaEditor").remove();
     // }
     mfgEditor.setCurrent($frame);
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
         // 文本data设置
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
         // $target.removeClass("overflowError");
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
 * 公式编辑器模块
 *
 **/
mfgEditor.prototype.formulaModule = function() {
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
         mfgEditor.setCurrent($frame);
         $(this).data("live",true);
         $frame.data("formula",true);
     }
     $frame.find(".textArea_tips").trigger("click");
        if ($('.keyboard_wrap').is(":visible")) {
                $(".keyboard_wrap").remove();
            } else {
                editorCanvas.creatFormulaKeyboard();
            }


     // 设置formulaEditor样式
     setTimeout(function(){
         $frame.addClass("focusStyle");
     },0);
     $(".jOutline").remove();
     return false;       
 });

};
mfgEditor.setCurrent = function (elem) {

}


function init_sEditorBox() {
    // var sEditorBoxHTML = '<div class="sEditorBox">\
				// 				<div class="searchForm sebForm clearfix pr" data-index="0">\
				// 						<div id="search_form" class="latex-outer clearfix pr">\
				// 							<div class="feSearchText latex-table l" minHeight="40" maxHeight="200" search="true"></div>\
				// 							<input class="search_text latex-textarea pa cS"/>\
				// 							<div class="search_tips latex-tip feTip pa">有作业问题？来找找答案吧！</div>\
				// 							<a href="###" class="formula_btn latex-clickBtn pa"></a>\
				// 						</div>\
				// 					</div>\
				// 				</div>\
				// 			</div>';
  var sEditorBoxHTML = '<div class="sEditorBox">\
                               <div class="editorForm sebForm  pr" data-index="1">\
                                    <div class="sEB_hd"></div>\
                                    <div class="sEB_bd">\
                                        <div class="editor_form clearfix pr"></div>\
                                    </div>\
                                    <div class="sEB_ft"></div>\
                                </div>\
                            </div>';
                            // var sEditorBoxHTML = '<div class="sEditorBox">\
                            //     <div class="searchForm sebForm clearfix pr" data-index="0">\
                            //         <div class="sEB_hd"></div>\
                            //         <div class="sEB_bd">\
                            //             <div id="search_form" class="latex-outer clearfix pr">\
                            //                 <div class="feSearchText latex-table l" minHeight="40" maxHeight="200" search="true"></div>\
                            //                 <input class="search_text latex-textarea pa cS"/>\
                            //                 <div class="search_tips latex-tip feTip pa">有作业问题？来找找答案吧！</div>\
                            //                 <a href="###" class="formula_btn latex-clickBtn pa"></a>\
                            //                 <a href="###" class="search_btn pa"></a>\
                            //             </div>\
                            //         </div>\
                            //         <div class="sEB_ft"></div>\
                            //     </div>\
                            //     <div class="editorForm sebForm hide pr" data-index="1">\
                            //         <div class="sEB_hd"></div>\
                            //         <div class="sEB_bd">\
                            //             <div class="editor_form clearfix pr"></div>\
                            //         </div>\
                            //         <div class="sEB_ft"></div>\
                            //     </div>\
                            //     <div class="editorForm_vip sebForm hide pr" data-index="2">\
                            //         <div class="sEB_hd"></div>\
                            //         <div class="sEB_bd">\
                            //             <div class="editor_form clearfix pr"></div>\
                            //         </div>\
                            //         <div class="sEB_ft"></div>\
                            //     </div>\
                            //     <div class="paperForm sebForm hide clearfix pr" data-index="3">\
                            //         <div class="sEB_hd"></div>\
                            //         <div class="sEB_bd">\
                            //             <div id="paper_form" class="latex-outer clearfix pr">\
                            //                 <input class="paper_text latex-textarea pa cS"/>\
                            //                 <div class="paper_tips latex-tip feTip pa">请输入你想找的试卷</div>\
                            //                 <a href="###" class="paper_del_btn pa"></a>\
                            //                 <a href="###" class="paper_btn pa"></a>\
                            //             </div>\
                            //         </div>\
                            //         <div class="sEB_ft"></div>\
                            //     </div>\
                            //     <em class="cArrow"></em>\
                            // </div>';
    $('.sEditorBoxWrp').append(sEditorBoxHTML);
}
$(function () {
    init_sEditorBox();
    initQaEditor();
    /*普通提问*/
    function initQaEditor(){
        if ($(".editorForm").length > 0 && $(".editorForm .editor_form .qaEditor").length == 0) {
            var qaEditor1 = new mfgEditor({
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
    
    /*搜题目*/
    (function initSearchTablet() {
        function openSearchPage() {
            var txt = editorCanvas.getFormulaTableValue($(".sEditorBox .searchForm"));
            txt = encodeURIComponent(txt);
            if ($.trim(txt) != "") {
                var href = 'http://www.7wenta.com/search/s?kw=' + txt;
                if (window.location.href.indexOf("/search/s") == -1) {
                    window.open(href);
                } else {
                    window.location.href = href;
                }
            };
        }

        /*公式搜索*/
        $(".searchForm .formula_btn").click(function () {
            if (!$(this).data("live") && !$("#search_form").data("formula")) {
                var searchVal = $(".search_text").val();
                editorCanvas.activeFormulaZone(searchVal, $(".feSearchText"));
                $("#search_form").data("formula", true);
                $(".search_text").remove();
                $(this).data("live", true);
            }

            if ($('.keyboard_wrap').is(":visible")) {
                $(".keyboard_wrap").remove();
            } else {
                editorCanvas.creatFormulaKeyboard();
            }
            $(".search_tips").trigger("click");
            return false;
        });
        $(".searchForm").on("click", "input,.lastcell,canvas", function () {
            if ($(".keyboard_wrap").find('#formulaEditor').length == 0) {
                $(".keyboard_wrap").remove();
                $("#formulaEditor").remove();
            }
        });
        $("body").on("blur", ".feSearchText .celltext", function () {
            setTimeout(function () {
                var txt = editorCanvas.getFormulaOutput($(".feSearchText"));
                if ($.trim(txt) == "" && document.activeElement != $("#textcell" + editorCanvas.outplane.list[editorCanvas.outplane.currentId]).find(".celltext")[0]) {
                    $(".search_tips").show();
                }
            }, 0);
        });
        //搜索回车提交
        $(".searchForm .editortablerow > td").live("keyup", (function (event) {
            if (event.keyCode == 13) {
                $(".search_btn").trigger("click");
            }
        }));
        $(".searchForm input").live("focus", function () {
            $(".search_tips").hide();
        });

        /*普通搜索*/
        $(".search_tips").click(function (e) {
            $(this).hide();
            $(".search_text").val("").trigger("focus");
            $(".feSearchText").find(".lastcell").trigger("click");
        });
        $(".search_text").bind("blur", function () {
            var txt = $.trim($(this).val());
            if (txt == "" || txt == $(".search_tips").text()) {
                $(".search_tips").show();
            }
        }).on("keyup", function (e) {
            if (e.keyCode == 13) {
                openSearchPage();
            };
        }).on("focus", function (e) {
            $(".search_tips").hide();
        });
        $(".search_btn").click(function () {
            openSearchPage();
            return false;
        });
    })();

   
});

//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外  
function banBackSpace(e) {
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
    var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea")
                && (vReadOnly == true || vEnabled != true)) ? true : false;

    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效  
    var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
                ? true : false;

    //判断  
    if (flag2) {
        return false;
    }
    if (flag1) {
        return false;
    }
}


//禁止后退键 作用于Firefox、Opera  
document.onkeypress = banBackSpace;
//禁止后退键  作用于IE、Chrome  
document.onkeydown = banBackSpace;

editorCanvas.acitveInsertButton = function () {
    $("#latex-insert").click(function () {
        if (!$(this).data("live")) {
            editorCanvas.changeTextAreaToTable($("#fezone"), 300, 200)
            var searchVal = $("#latex-textarea").val();
            editorCanvas.activeFormulaZone(searchVal, $("#latex-table"));
            $("#latex-textarea").hide();
            $("#latex-outer").data("formula", true);
            $(this).data("live", true);
        }
        if ($('.keyboard_wrap').is(":visible")) {
            $(".keyboard_wrap").remove();
        } else {
            editorCanvas.creatFormulaKeyboard();
            
        }
        $("#latex-table").find(".lastcell").trigger("click");
        return false;
    });
}
editorCanvas.changeTextAreaToTable = function (elem, width, height) {
    var latexFormulaEditorHTMl = '<div class="latex-zone" id="latex-outer" style="position:relative;">\
									<div class="latex-zone" id="latex-table" style="position:absolute;left:0px;top:0px;overflow:auto;"></div>\
									<textarea class="latex-zone" id="latex-textarea" style="position:absolute;left:0px;top:0px;"></textarea>\
								</div>';
    elem.append(latexFormulaEditorHTMl);
    $(".latex-zone").css({
        width: width,
        height: height
    });
}
// hasEntity为true，取到有实体符号的值，提交的给后端的时候一定要设成true
editorCanvas.getFormulaTableValue = function (elem, hasEntity) {
    var searchVal = "";
    var target = elem;
    if (!elem.hasClass("latex-outer")) {
        target = elem.find(".latex-outer");
    }
    if (target.data("formula")) {
        searchVal = editorCanvas.getFormulaOutput(target.find(".latex-table"));
    } else {
        searchVal = target.find(".latex-textarea").val();
    }
    return hasEntity ? searchVal : searchVal.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

editorCanvas.creatFormulaKeyboard = function (elem) {
    In('keyboard_js', function () {
        editorCanvas.creatFormulaKeyboard(elem);
    });
}