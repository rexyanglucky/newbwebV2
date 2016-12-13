editorCanvas.creatFormulaKeyboard = function () {
    /*type:0 symbol；type 1 operation*/
    var feMathArr = [
	{ type: "0", value: "+", name: "add", title: "加号" },//加号
	{ type: "0", value: "-", name: "minus", title: "减号" },//减号
	{ type: "0", value: "×", name: "fraction", title: "乘号" },//乘号
	{ type: "0", value: "÷", name: "mutiple", title: "除号" },//除号
	{ type: "0", value: "•", name: "mutiple", title: "点乘" },//点乘
	{ type: "1", value: "fraction", name: "fraction", title: "分式" },//分式
	{ type: "1", value: "square", name: "square", title: "平方" },//平方
	{ type: "1", value: "cube", name: "cube", title: "立方" },//立方
	{ type: "1", value: "abs", name: "abs", title: "绝对值" },//绝对值
	{ type: "0", value: "π", name: "pi", title: "派" },//派
	{ type: "0", value: "°", name: "degree", title: "度" },//度
	{ type: "0", value: "≈", name: "mutiple", title: "约等于" },//约等于
	{ type: "0", value: "≠", name: "mutiple", title: "不等于" },//不等于
	{ type: "0", value: "<", name: "small", title: "小于" },//小于
	{ type: "0", value: ">", name: "big", title: "大于" },//大于	
	{ type: "0", value: "≤", name: "mutiple", title: "小于等于" },//小于等于
	{ type: "0", value: "≥", name: "mutiple", title: "大于等于" },//大于等于	
	{ type: "0", value: "±", name: "mutiple", title: "正负号" },//正负号
	{ type: "1", value: "radicent", name: "radicent2", title: "根号" },//根号
	{ type: "1", value: "radicent", name: "radicent3", title: "立方根" },//立方根
	{ type: "1", value: "exponent", name: "exponent", title: "n次方" },//n次方
	{ type: "1", value: "subscript", name: "subscript", title: "下标" },//下标
	{ type: "0", value: "∵", name: "because", title: "因为" },//因为
	{ type: "0", value: "∴", name: "therefore", title: "所以" },//所以
	{ type: "0", value: "∠", name: "mutiple", title: "角" },//角
	{ type: "0", value: "//", name: "mutiple", title: "平行" },//平行
	{ type: "0", value: "⊥", name: "mutiple", title: "垂直" },//垂直
	{ type: "0", value: "≅", name: "mutiple", title: "全等" },//全等
	{ type: "0", value: "∽", name: "mutiple", title: "相似" },//相似
	{ type: "0", value: "△", name: "mutiple", title: "三角形" },//三角形
	{ type: "0", value: "▱", name: "rhomboid", title: "平行四边形" },//平行四边形
	// {type:"0",value:"À",name:"rhomboid",title:"平行四边形"},//平行四边形
	{ type: "0", value: "⊙", name: "mutiple", title: "圆心" },//圆心
	{ type: "1", value: "equation2x", name: "equation2x", title: "二元方程组" },//二元方程组
	{ type: "1", value: "equation3x", name: "equation3x", title: "三元方程组" },//三元方程组
	{ type: "1", value: "widehat", name: "widehat", title: "圆弧" },//圆弧
	{ type: "0", value: "∈", name: "mutiple", title: "属于" },//属于
	{ type: "0", value: "∉", name: "mutiple", title: "不属于" },//不属于
	{ type: "0", value: "⊆", name: "mutiple", title: "左包含" },//左包含
	{ type: "0", value: "⊇", name: "mutiple", title: "右包含" },//右包含
	{ type: "1", value: "log", name: "log_subsup", title: "对数" },//对数
	{ type: "0", value: "∞", name: "mutiple", title: "无穷" },//无穷
	{ type: "0", value: "∪", name: "mutiple", title: "并集" },//并集
	{ type: "0", value: "∩", name: "mutiple", title: "交集" },//交集
	{ type: "1", value: "∫", name: "integral", title: "积分" },//积分
	{ type: "1", value: "——>", name: "overrightarrow", title: "向量" },//向量
	{ type: "1", value: "∑", name: "sum", title: "求和" },//求和
	{ type: "0", value: "φ", name: "mutiple", title: "φ" },//φ
	{ type: "0", value: "α", name: "mutiple", title: "α" },//α
	{ type: "0", value: "β", name: "mutiple", title: "β" },//β
	{ type: "0", value: "γ", name: "mutiple", title: "γ" },//γ
	{ type: "0", value: "ρ", name: "mutiple", title: "ρ" },//ρ
	{ type: "0", value: "Ω", name: "mutiple", title: "Ω" },//Ω
	{ type: "0", value: "θ", name: "mutiple", title: "θ" },//θ
	{ type: "0", value: "彐", name: "mutiple", title: "彐" },//彐
	{ type: "0", value: "η", name: "mutiple", title: "η" },//η
	{ type: "0", value: "λ", name: "mutiple", title: "λ" },//λ
	{ type: "0", value: "ω", name: "mutiple", title: "ω" },//ω
	{ type: "0", value: "μ", name: "mutiple", title: "μ" },//μ
	{ type: "0", value: "ψ", name: "mutiple", title: "ψ" },//ψ
	{ type: "0", value: "ξ", name: "mutiple", title: "ξ" },//ξ
	{ type: "0", value: "δ", name: "mutiple", title: "δ" },//δ
	{ type: "1", value: "radicent", name: "radicent", title: "根号" },//根号
	{ type: "1", value: "limit", name: "limit_leftright", title: "根号" }//极限
    ];
    var feChemArr = [
	{ type: "1", value: "×", name: "GWconditions", title: "高温" },//高温
	{ type: "1", value: "÷", name: "JRconditions", title: "加热" },//加热
	{ type: "1", value: "•", name: "DRconditions", title: "点燃" },//点燃
	{ type: "1", value: "fraction", name: "DJconditions", title: "电解" },//电解
	{ type: "1", value: "square", name: "TDconditions", title: "通电" },//通电
	{ type: "1", value: "//", name: "BZconditions", title: "爆炸" },//爆炸
	{ type: "1", value: "cube", name: "FDconditions", title: "放电" },//放电
	{ type: "1", value: "abs", name: "CHJconditions", title: "催化剂" },//催化剂
	{ type: "1", value: "π", name: "JHMconditions", title: "酒化酶" },//酒化酶
	{ type: "1", value: "°", name: "SJconditions", title: "三角" },//三角
	{ type: "1", value: "≈", name: "MNO2conditions", title: "MnO2" },//MnO2
	{ type: "1", value: "≠", name: "JR2conditions", title: "加热" },//加热
	{ type: "1", value: "≠", name: "GW2conditions", title: "高温" },//高温
	{ type: "1", value: "≤", name: "TD2conditions", title: "通电" },//通电
	{ type: "1", value: "≥", name: "MNO22conditions", title: "MnO2" },//MnO2	
	{ type: "1", value: "±", name: "JHM2conditions", title: "酒化酶" },//酒化酶
	{ type: "1", value: "radicent", name: "M2conditions", title: "酶" },//酶
	{ type: "1", value: "radicent", name: "DFM2conditions", title: "淀粉酶" },//淀粉酶
	{ type: "1", value: "exponent", name: "TYN1CHJconditions", title: "太阳能" },//太阳能
	{ type: "1", value: "subscript", name: "CHJ1GWGYconditions", title: "高温压" },//高温压
	{ type: "1", value: "∵", name: "MNO21SJconditions", title: "MnO2" },//MnO2
	{ type: "1", value: "∵", name: "CHJ2SJconditions", title: "催化剂" },//催化剂
	{ type: "1", value: "∠", name: "twolinefrac", title: "等价" },//==	
	{ type: "1", value: "⊥", name: "rowfrac", title: "单向" },//->
	{ type: "1", value: "∽=", name: "twoarrowfrac", title: "双向" }//,双向
	//{type:"1",value:"∽",name:"arrowfrac",title:"等价"}//等价
    ];
    var feStyleArr = [
    { type: "2", value: "Bold", name: "Bold", title: "加粗" },//加粗
	{ type: "2", value: "Itaily", name: "Itaily", title: "斜体" },//斜体
	{ type: "2", value: "UnderLine", name: "UnderLine", title: "下划线" },//下划线
	{ type: "2", value: "ThroughLine", name: "ThroughLine", title: "删除线" },//删除线
    { type: "3", value: "Table", name: "Table", title: "表格" },//表格
    { type: "3", value: "http://www.mofangge.com/css/style1/img/changeskinlogo.png", name: "Image", title: "图片" },//电解
    ];

    var insertHtml =
    {
        Table: "Table",
        Image: "Image",
    };

    var drag = function (elem) {
        var self = elem[0];

        var dv = elem.parent()[0];

        self.onmousedown = function (e) {
            var d = document;
            var page = {
                event: function (evt) {
                    var ev = evt || window.event;
                    return ev;
                },
                pageX: function (evt) {
                    var e = this.event(evt);
                    return e.pageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
                },
                pageY: function (evt) {
                    var e = this.event(evt);
                    return e.pageY || (e.clientY + document.body.scrollTop - document.body.clientTop);
                },
                layerX: function (evt) {
                    var e = this.event(evt);
                    return e.layerX || e.offsetX;
                },
                layerY: function (evt) {
                    var e = this.event(evt);
                    return e.layerY || e.offsetY;
                }
            }
            var x = page.layerX(e);
            var y = page.layerY(e);
            if (dv.setCapture) {
                dv.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
            d.onmousemove = function (e) {
                var tx = page.pageX(e) - x;
                var ty = page.pageY(e) - y;
                dv.style.left = tx + "px";
                dv.style.top = ty + "px";
            }
            d.onmouseup = function () {
                if (dv.releaseCapture) {
                    dv.releaseCapture();
                } else if (window.releaseEvents) {
                    window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }
                d.onmousemove = null;
                d.onmouseup = null;
            }
        }
    };
    function preview(e) {
        var file = e.target.files[0];
        var supportedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (file && supportedTypes.indexOf(file.type) >= 0) {
            if (typeof FileReader === 'undefined') {

            }
            else {
                var oReader = new FileReader();
                oReader.onload = function (e) {
                    $(".pimg").attr("src", e.target.result);
                };
                oReader.readAsDataURL(file);

            }
        } else {
            if (file) {
                u.showPopMsg('文件格式只支持：jpg、jpeg 和 png');
            }
        }
    }
    function getfeList(feArr) {
        var feList = ''
        for (var i = 0; i < feArr.length; i++) {
            feList += '<li class="fe-btnItem"><a data-type="' + feArr[i]["type"] + '"data-value="' + feArr[i]["value"] + '" data-name="' + feArr[i]["name"] + '" href="###" style="background-position:' + (-i * 45) + 'px 0px;"title="' + feArr[i]["title"] + '"class="fe-btn fe-btn' + i + '"></a></li>';
        };
        return feList;
    };

    var dialog = '<div class="keyboard_wrap">' +
    '<div class="title">' +
        '<span>公式编辑器</span>' +
        '<i class="all-icon del-icon"></i>' +
    '</div>' +
    '<div class="content" id="editorDialog">' +
    '</div>' +
	'</div>';
    $("body").append(dialog);
    $(".del-icon").mousedown(function () { $(".keyboard_wrap").remove(); return false; });

    var target = $("#editorDialog");
    var feHTML = '<div id="formulaEditor" class="mfgEditor">'
					+ '<div class="fe-hd"></div>'
					+ '<div class="fe-bd">'
						+ '<div class="fe-switchs clearfix">'
							+ '<a href="###" class="fe-switch fe-switch-2 l fe-cur">样式</a>'
							+ '<a href="###" class="fe-switch fe-switch-0 l">数学</a>'
							+ '<a href="###" class="fe-switch fe-switch-1 l">化学</a>'

						+ '</div>'
						+ '<div class="fe-Main">'
							+ '<div class="fe-MathWrp">'
								+ '<div class="fe-Math">'
									+ '<ul class="fe-btnList lil clearfix">'
									+ getfeList(feMathArr)
									+ '</ul>'
								+ '</div>'
							+ '</div>'
							+ '<div class="fe-ChemWrp">'
								+ '<div class="fe-Chem">'
									+ '<ul class="fe-btnList lil clearfix">'
									+ getfeList(feChemArr)
									+ '</ul>'
								+ '</div>'
							+ '</div>'
							+ '<div class="fe-StyleWrp">'
								+ '<div class="fe-Style">'
									+ '<ul class="fe-btnList lil clearfix">'
									+ getfeList(feStyleArr)
									+ '</ul>'
								+ '</div>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
					+ '<div class="fe-ft"></div>'
				+ '</div>';
    var $feHTML = $(feHTML);
    (function openEditor() {

        $feHTML.find(".fe-switch").click(function () {
            if ($(this).hasClass("fe-switch-0")) {
                $feHTML.find(".fe-MathWrp").show().siblings().hide();
            } else if ($(this).hasClass("fe-switch-1")) {
                $feHTML.find(".fe-ChemWrp").show().siblings().hide();
            }
            else if ($(this).hasClass("fe-switch-2")) {
                // $feHTML.find(".fe-StyleWrp").hide();
                $feHTML.find(".fe-StyleWrp").show().siblings().hide();
            }
            $feHTML.find(".fe-switch").removeClass("fe-cur");
            $(this).addClass("fe-cur");
            return false;
        });


        $feHTML.find(".fe-btn").mousedown(function () {
            //todo
            $("#tableset").remove();
            $("#imgset").remove();
            var $this = $(this);
            if ($(this).data("type") == 1) {
                // console.log("a", $(this));
                editorCanvas.outplane.addList($(this).data("name"));
            } else if ($(this).data("type") == 0) {
                // console.log("b", $(this));
                editorCanvas.outplane.addSign($(this).data("value"));
            } else if ($(this).data("type") == 2) {
                editorCanvas.outplane.addStyle($(this).data("value"));
            }
            else if ($(this).data("type") == 3) {
                switch ($(this).data("name")) {
                    case insertHtml.Table:
                        { 
                            $("#tableset").remove();
                            $(".fe-StyleWrp").append('<div id="tableset">' +
                                '<input id="cloumnNum" type="number" placeholder="列数"><label>列</label>' +
                                '<br>' +
                                '<input id="rowNum" type="number" placeholder="行数"><label>行</label>' +
                                '<input type="button" value="确定" id="showTable">' +
                                '</div>');
                            $("#showTable").unbind("click");
                            $("#showTable").click(function () {
                                editorCanvas.outplane.addTable($("#rowNum").val(),$("#cloumnNum").val());
                            });
                        }
                        break;
                    case insertHtml.Image:
                        {
                            $("#imgset").remove();
                            $(".fe-StyleWrp").append('<div id="imgset" >' +
                                '<div class="photo_choice">'+
                                '<input type="file" class="upimg">' +
                                '<img src="../resource/formulaEditor/air/feEditor/img_s/addimg.png" class="pimg"/>' +
                                '</div><input type="button" value="上传" id="btnupimg"/><br/>' +
                                '<input id="imgurl" type="url" placeholder="请输入图片url"/>' +
                                '<input type="button" value="确定" id="showImg"/></div>');
                            $("#showImg").unbind("click");
                            $("#showImg").click(function () {
                                editorCanvas.outplane.addImg($("#imgurl").val() || $this.data("value"));
                                $(".pimg")[0].src = "../resource/formulaEditor/air/feEditor/img_s/addimg.png";
                                $("#imgurl").val("");

                            });
                            $("#upimg").unbind("change");
                            $(".upimg").change(function(e) {
                                preview(e, this);
                            });
                            $("#btnupimg").unbind("click");
                            $("#btnupimg").click(function() {
                                $.ajax({
                                    url: "http://localhost:5483/ImgUp.ashx",
                                    type: "POST",
                                    data: { img: $(".pimg")[0].src },
                                    success: function(data) {
                                        $("#imgurl").val(data);
                                    },
                                    error: function() {
                                        alert("上传失败");
                                    }
                                });
                            });


                        }
                        break;

                    default:
                        break;
                }
               
               

            };
            return false;
        }).hover(function () {
            $(this).css("background-position-y", "-36px");
        }, function () {
            $(this).css("background-position-y", "0px");
        }).click(function () {
            return false;
        });


        target.html("");
        $feHTML.appendTo(target);

        drag(target.prev());


    })();

}