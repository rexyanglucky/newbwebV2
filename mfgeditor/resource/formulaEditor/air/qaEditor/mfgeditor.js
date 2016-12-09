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

    };
    this.settings = $.extend({}, _defaults, opts);

    this.init();
}

mfgEditor.prototype.reset = function () {
   
};

mfgEditor.prototype.init = function () {
    
};

mfgEditor.setCurrent = function (elem) {

}


function init_sEditorBox() {
    var sEditorBoxHTML = '<div class="sEditorBox">\
								<div class="searchForm sebForm clearfix pr" data-index="0">\
										<div id="search_form" class="latex-outer clearfix pr">\
											<div class="feSearchText latex-table l" minHeight="40" maxHeight="200" search="true"></div>\
											<input class="search_text latex-textarea pa cS"/>\
											<div class="search_tips latex-tip feTip pa">有作业问题？来找找答案吧！</div>\
											<a href="###" class="formula_btn latex-clickBtn pa"></a>\
										</div>\
									</div>\
								</div>\
							</div>';
    $('.sEditorBoxWrp').append(sEditorBoxHTML);
}
$(function () {
    init_sEditorBox();
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