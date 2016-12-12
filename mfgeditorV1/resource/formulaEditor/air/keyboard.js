editorCanvas.creatFormulaKeyboard = function(target){
	/*type:0 symbol；type 1 operation*/
	var feMathArr = [
	{type:"0",value:"+",name:"add",title:"加号"},//加号
	{type:"0",value:"-",name:"minus",title:"减号"},//减号
	{type:"0",value:"×",name:"fraction",title:"乘号"},//乘号
	{type:"0",value:"÷",name:"mutiple",title:"除号"},//除号
	{type:"0",value:"•",name:"mutiple",title:"点乘"},//点乘
	{type:"1",value:"fraction",name:"fraction",title:"分式"},//分式
	{type:"1",value:"square",name:"square",title:"平方"},//平方
	{type:"1",value:"cube",name:"cube",title:"立方"},//立方
	{type:"1",value:"abs",name:"abs",title:"绝对值"},//绝对值
	{type:"0",value:"π",name:"pi",title:"派"},//派
	{type:"0",value:"°",name:"degree",title:"度"},//度
	{type:"0",value:"≈",name:"mutiple",title:"约等于"},//约等于
	{type:"0",value:"≠",name:"mutiple",title:"不等于"},//不等于
	{type:"0",value:"<",name:"small",title:"小于"},//小于
	{type:"0",value:">",name:"big",title:"大于"},//大于	
	{type:"0",value:"≤",name:"mutiple",title:"小于等于"},//小于等于
	{type:"0",value:"≥",name:"mutiple",title:"大于等于"},//大于等于	
	{ type: "0", value: "±", name: "mutiple", title: "正负号" },//正负号
	{type:"1",value:"radicent",name:"radicent2",title:"根号"},//根号
	{type:"1",value:"radicent",name:"radicent3",title:"立方根"},//立方根
	{type:"1",value:"exponent",name:"exponent",title:"n次方"},//n次方
	{type:"1",value:"subscript",name:"subscript",title:"下标"},//下标
	{type:"0",value:"∵",name:"because",title:"因为"},//因为
	{type:"0",value:"∴",name:"therefore",title:"所以"},//所以
	{type:"0",value:"∠",name:"mutiple",title:"角"},//角
	{type:"0",value:"//",name:"mutiple",title:"平行"},//平行
	{type:"0",value:"⊥",name:"mutiple",title:"垂直"},//垂直
	{type:"0",value:"≅",name:"mutiple",title:"全等"},//全等
	{type:"0",value:"∽",name:"mutiple",title:"相似"},//相似
	{type:"0",value:"△",name:"mutiple",title:"三角形"},//三角形
	{type:"0",value:"▱",name:"rhomboid",title:"平行四边形"},//平行四边形
	// {type:"0",value:"À",name:"rhomboid",title:"平行四边形"},//平行四边形
	{type:"0",value:"⊙",name:"mutiple",title:"圆心"},//圆心
	{type:"1",value:"equation2x",name:"equation2x",title:"二元方程组"},//二元方程组
	{type:"1",value:"equation3x",name:"equation3x",title:"三元方程组"},//三元方程组
	{type:"1",value:"widehat",name:"widehat",title:"圆弧"},//圆弧
	{type:"0",value:"∈",name:"mutiple",title:"属于"},//属于
	{type:"0",value:"∉",name:"mutiple",title:"不属于"},//不属于
	{type:"0",value:"⊆",name:"mutiple",title:"左包含"},//左包含
	{type:"0",value:"⊇",name:"mutiple",title:"右包含"},//右包含
	{type:"1",value:"log",name:"log_subsup",title:"对数"},//对数
	{type:"0",value:"∞",name:"mutiple",title:"无穷"},//无穷
	{type:"0",value:"∪",name:"mutiple",title:"并集"},//并集
	{type:"0",value:"∩",name:"mutiple",title:"交集"},//交集
	{type:"1",value:"∫",name:"integral",title:"积分"},//积分
	{type:"1",value:"——>",name:"overrightarrow",title:"向量"},//向量
	{type:"1",value:"∑",name:"sum",title:"求和"},//求和
	{type:"0",value:"φ",name:"mutiple",title:"φ"},//φ
	{type:"0",value:"α",name:"mutiple",title:"α"},//α
	{type:"0",value:"β",name:"mutiple",title:"β"},//β
	{type:"0",value:"γ",name:"mutiple",title:"γ"},//γ
	{type:"0",value:"ρ",name:"mutiple",title:"ρ"},//ρ
	{type:"0",value:"Ω",name:"mutiple",title:"Ω"},//Ω
	{type:"0",value:"θ",name:"mutiple",title:"θ"},//θ
	{type:"0",value:"彐",name:"mutiple",title:"彐"},//彐
	{type:"0",value:"η",name:"mutiple",title:"η"},//η
	{type:"0",value:"λ",name:"mutiple",title:"λ"},//λ
	{type:"0",value:"ω",name:"mutiple",title:"ω"},//ω
	{type:"0",value:"μ",name:"mutiple",title:"μ"},//μ
	{type:"0",value:"ψ",name:"mutiple",title:"ψ"},//ψ
	{type:"0",value:"ξ",name:"mutiple",title:"ξ"},//ξ
	{ type: "0", value: "δ", name: "mutiple", title: "δ" },//δ
	{ type: "1", value: "radicent", name: "radicent", title: "根号" },//根号
	{ type: "1", value: "limit", name: "limit_leftright", title: "根号" }//极限
	];
	var feChemArr = [
	{type:"1",value:"×",name:"GWconditions",title:"高温"},//高温
	{type:"1",value:"÷",name:"JRconditions",title:"加热"},//加热
	{type:"1",value:"•",name:"DRconditions",title:"点燃"},//点燃
	{type:"1",value:"fraction",name:"DJconditions",title:"电解"},//电解
	{type:"1",value:"square",name:"TDconditions",title:"通电"},//通电
	{type:"1",value:"//",name:"BZconditions",title:"爆炸"},//爆炸
	{type:"1",value:"cube",name:"FDconditions",title:"放电"},//放电
	{type:"1",value:"abs",name:"CHJconditions",title:"催化剂"},//催化剂
	{type:"1",value:"π",name:"JHMconditions",title:"酒化酶"},//酒化酶
	{type:"1",value:"°",name:"SJconditions",title:"三角"},//三角
	{type:"1",value:"≈",name:"MNO2conditions",title:"MnO2"},//MnO2
	{type:"1",value:"≠",name:"JR2conditions",title:"加热"},//加热
	{type:"1",value:"≠",name:"GW2conditions",title:"高温"},//高温
	{type:"1",value:"≤",name:"TD2conditions",title:"通电"},//通电
	{type:"1",value:"≥",name:"MNO22conditions",title:"MnO2"},//MnO2	
	{type:"1",value:"±",name:"JHM2conditions",title:"酒化酶"},//酒化酶
	{type:"1",value:"radicent",name:"M2conditions",title:"酶"},//酶
	{type:"1",value:"radicent",name:"DFM2conditions",title:"淀粉酶"},//淀粉酶
	{type:"1",value:"exponent",name:"TYN1CHJconditions",title:"太阳能"},//太阳能
	{type:"1",value:"subscript",name:"CHJ1GWGYconditions",title:"高温压"},//高温压
	{type:"1",value:"∵",name:"MNO21SJconditions",title:"MnO2"},//MnO2
	{type:"1",value:"∵",name:"CHJ2SJconditions",title:"催化剂"},//催化剂
	{type:"1",value:"∠",name:"twolinefrac",title:"等价"},//==	
	{type:"1",value:"⊥",name:"rowfrac",title:"单向"},//->
	{type:"1",value:"∽=",name:"twoarrowfrac",title:"双向"}//,双向
	//{type:"1",value:"∽",name:"arrowfrac",title:"等价"}//等价
	];
	function getfeList(feArr){
		var feList = ''
		for (var i = 0; i < feArr.length; i++) {
			feList += '<li class="fe-btnItem"><a data-type="'+ feArr[i]["type"] +'"data-value="'+ feArr[i]["value"] +'" data-name="'+ feArr[i]["name"] +'" href="###" style="background-position:'+ (-i*45) + 'px 0px;"title="'+ feArr[i]["title"] +'"class="fe-btn fe-btn'+ i +'"></a></li>';
		};
		return feList;
	};
	var feHTML = '<div id="formulaEditor" class="feEditor pa">'
					+'<div class="fe-hd"></div>'
					+'<div class="fe-bd">'
						+'<div class="fe-switchs clearfix">'
							+'<a href="###" class="fe-switch fe-switch-0 l fe-cur">数学</a>'
							+'<a href="###" class="fe-switch fe-switch-1 l">化学</a>'
						+'</div>'
						+'<div class="fe-Main">'
							+'<div class="fe-MathWrp">'
								+'<div class="fe-Math">'
									+'<ul class="fe-btnList lil clearfix">'
									+ getfeList(feMathArr)
									+'</ul>'
								+'</div>'
								+'<div class="fe-More tC">查看更多</div>'
							+'</div>'
							+'<div class="fe-ChemWrp">'
								+'<div class="fe-Chem">'
									+'<ul class="fe-btnList lil clearfix">'
									+ getfeList(feChemArr)
									+'</ul>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'<div class="fe-ft"></div>'
				+'</div>';
	var $feHTML = $(feHTML);
	(function feUIBind(){
		$feHTML.find(".fe-switch").click(function(){
			if ($(this).hasClass("fe-switch-0")) {
				$feHTML.find(".fe-MathWrp").show();
				$feHTML.find(".fe-ChemWrp").hide();
			}else{
				$feHTML.find(".fe-MathWrp").hide();
				$feHTML.find(".fe-ChemWrp").show();
			}
			$feHTML.find(".fe-switch").removeClass("fe-cur");
			$(this).addClass("fe-cur");
			ajustEditorPos();
			return false;
		});
		$feHTML.find(".fe-More").toggle(function(){
			$(this).html("收起").addClass("more-open");
			$feHTML.find(".fe-Math").css({height:190});
			ajustEditorPos();
			return false;
		},function(){
			$(this).html("查看更多").removeClass("more-open");
			$feHTML.find(".fe-Math").css({height:114});
			ajustEditorPos();
			return false;
		});

		$feHTML.find(".fe-btn").mousedown(function(){
			if ($(this).data("type") == 1) {
				// console.log("a", $(this));
				editorCanvas.outplane.addList($(this).data("name"));			
			}else if ($(this).data("type") == 0) {
				// console.log("b", $(this));
				editorCanvas.outplane.addSign($(this).data("value"));
			};
			// $(this).closest(".feEditor").parent().find(".feTip").hide();
			return false;
		}).hover(function(){
			$(this).css("background-position-y","-36px");
		},function(){
			$(this).css("background-position-y","0px");
		}).click(function(){
			ajustEditorPos();
			return false;
		});	
		
		if (target.find("#formulaEditor").length == 0) {
			$("#formulaEditor").remove();
			$feHTML.appendTo(target);
		}else{
			$("#formulaEditor").toggle();
		}

		$(".editortablerow > td").live("keyup",function(){
			setTimeout(function(){
				ajustEditorPos();
			},0);			
		});
		
		ajustEditorPos();

		function ajustEditorPos(){
			if($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")){
				$("#formulaEditor").css({left:0,top:target.height()+9});
			}else{
				$("#formulaEditor").css({left:0,bottom:-($("#formulaEditor").height()+9)});
			}
		}
	})();

  
	
}