/* 
	插入@用户功能控件
 */
(function($, window, document, undefined){
	$.fn.addFollowing = function(opts){
		var self = this;
		var settings = {
			addUser : null,
			refreshData : null,
			cancelIds : [],
			loading_img : static_domain + "qa/style/img_s/loading.gif",
			default_head : static_domain + "qa/resource/image/default_head.png",
			url : qa_domain + "relationship/searchFollowing.json",
			xbUrl : qa_domain + "tuiJianXueba.json",
			xbCount : 3, //需要获取的学霸数量
			grade : 0,
			course : 0,
			limit : 10
		};
		$.extend(settings,opts);
		var key = "",cur = -1,len = 0;

		var styles = [{background:"#fff",color:"#999"},{background:"#e9e9e9",color:"#999"},{background:"#fff",color:"#f90"},{background:"#ffbb39",color:"#fff"}];
		
		var $addBtn = $('<a href="###" hidefocus class="askBtn addF_btn"><span class="btn-text">问学霸</span></a>');
		$addBtn.appendTo(self);
		
		$addBtn.bind('click',function(){
			if (hasLogin) {
				if($("#addFollowing").length){
					remove();
				}else{
					addInfo();
				}
			}else{
				new popLogin({submitSuccessCallback:function(){}});
			}
			$(".tips_box").hide();
			//return false;
		}).bind("mouseenter",function(){
			var $t = $(this);
			In("wtTips_js",function(){
				wtTips({
					content : "问学霸可以使你的问题更快地得到解答哦~",
					showPos : 2,
					$refer : $t,
					maxWidth : 220,
					autoDisappear : false,
					appear : function(){
						$(this).find(".tips_boxCnt").css({'background':'none','border':'none'});
						$(this).find(".tips_bg").css({background:'url('+static_domain+'qa/style/img_s/tips/tips_1.png) no-repeat 0 0',color:'#fff',padding:'8px','font-size':'12px','line-height':'18px'});
					},
					show : function(){
						var $this = $(this);
						$t.mouseleave(function(){
							$this.remove();
						});
					}
				});
			});
		});
		
		function addInfo(){
			var pos = $addBtn.offset(),
				left = pos.left + $addBtn.outerWidth();
			if(!$("#addFollowing").length){
				var addInfoHtml = '<div id="addFollowing" style="width:120px;border:1px solid #d0d0d0;color:#999;font-size:12px;background:#fff;position:absolute;z-index:500;">' +
				'<div style="height:22px;line-height:22px;"><input type="text" id="af_txt" value="'+ key +'" style="color:#666;cursor:text;width:104px;height:22px;display:block;padding:0 8px;border:none;background:none;outline:none;"/>' + 
				'<label for="af_txt" class="af_label" style="cursor:text;margin-left:8px;position:absolute;display:'+ (key ? 'none' : 'block') +';margin-top:-22px;">选择你想问的人</label></div>' +
				'<ul class="af_list" style="line-height:30px;"></ul></div>';
				$(addInfoHtml).css({top:pos.top,left:left}).appendTo("body");
				$("#af_txt").focus();
				
				$("#af_txt").keydown(function(){
					if($.trim($(this).val())){
						$("#addFollowing .af_label").hide();
					}
				});
				$("#af_txt").keyup(function(e){
					switch(e.which){
						case 38: 
							cur = --cur % len;
							curStyle();
							//$("#addFollowing .af_it").css("background","#fff").eq(cur).css("background","#e9e9e9");
							break;
						case 40:
							cur = ++cur % len;
							curStyle();
							//$("#addFollowing .af_it").css("background","#fff").eq(cur).css("background","#e9e9e9");
							break;
						case 13:
							getData();
							remove();
							break;
						default:
							var val = $.trim($(this).val());
							if(!val){
								$("#addFollowing .af_label").show();
							}else{
								$("#addFollowing .af_label").hide();
							}
							(val != key) && (key = val);
							addList();
					}
				});
				
				$("#addFollowing .af_label,#af_txt").click(function(){
					$("#af_txt").focus();
					return false;
				});
			}else{
				$("#addFollowing").css({top:pos.top,left:left});
			}
			var h = -$("#addFollowing").outerHeight() / 2;
			$("#addFollowing").append('<img src="'+settings.loading_img+'" id="af_load" style="display:block;margin-left:50px;position:absolute;margin-top:'+h+'px"/>');
			
			addList();
		}

		function curStyle(){
			$("#addFollowing .af_it_0").css({"background":styles[0].background,"color":styles[0].color});
			$("#addFollowing .af_it_1").css({"background":styles[2].background,"color":styles[2].color});
			var $tg = $("#addFollowing .af_it").eq(cur);
			if($tg.hasClass("af_it_0")){
				$tg.css({"background":styles[1].background,"color":styles[1].color});
			}else{
				$tg.css({"background":styles[3].background,"color":styles[3].color});
			}
		}
		
		function addList(){
			var url = settings.url;
			if(!key){url += '?key=""';}
			settings.refreshData && settings.refreshData.call(settings);
			$.post(url,{key:key, limit: settings.limit},function(data){
				if(data.resultCode.code == 0){
					//获取学霸名单
					var content = data.userRelationShips;
					if(settings.grade && settings.course && content.length < 3){
						$.post(settings.xbUrl,{gradeId: settings.grade, courseId: settings.course, count: settings.xbCount},function(xbData){
							var xbArr;
							if(xbData.result.resultCode.code == 0){
								xbArr = avoidDuplication(content, xbData.result.value.xuebas);
								content = content.concat(xbArr);
							}
							addListCallBack(content);
						});
					}
					else{
						addListCallBack(content);
					}
				}else if(data.resultCode.code == -7){
					new popLogin({submitSuccessCallback:addList});
				}
			});
		}

		function addListCallBack(data){
			cur = 0;
			var addListHtml = listHtml(data);

			$("#addFollowing .af_list").html(addListHtml);
			$("#af_load").remove();
			
			$("#addFollowing .af_it").mouseenter(function(){
				cur = $(this).index(".af_it");
				curStyle();
			}).click(function(){
				cur = $(this).index(".af_it");
				getData();
				settings.cancelIds = [];
				remove();
				return false;
			});

			$("body").bind("click",remove);
		}

		function listHtml(data){
			var addListHtml = "";
			len = data.length;
			if(len){
				for(var val = 0; val < data.length; val ++){
					var info;
					if(data[val].destUserInfo){
						info = data[val].destUserInfo.userBasicInfo;
						info.idType = 0; //idType标识该用户是否系统推荐学霸，0不是，1是
					}else{
						info = data[val];
						info.idType = 1; 
					}
					var img = info.picUrl || settings.default_head,
						flag = false;
					for (var i = settings.cancelIds.length - 1; i >= 0; i--) {
						if(settings.cancelIds[i] == info.userId){
							flag = true;break;
						}
					};
					
					if(!flag){
						var sIndex = (info.idType ? 2 : 0) + (val ? 0 : 1);
						addListHtml += '<li class="af_it af_it_'+ info.idType +' clearfix" style="height:30px;cursor:pointer;background:'
							+ styles[sIndex].background +';color:'+styles[sIndex].color+';" userId="'+
							info.userId +'"'+ (info.idType ? 'title="问他推荐学霸"':'') +'><img src="'+
							img + '" class="l" style="width:24px;height:24px;margin:3px 8px;"/><span class="toh" style="width:72px;display:block;">'+
							(info.name || info.userName) + '</span></li>';
					}else{
						len --;
					}
				}
			}else{
				addListHtml += '<li class="af_it clearfix" style="height:30px;cursor:default;background:#e9e9e9;"><span style="padding-left:8px;">没有找到学霸</span></li>';
			}
			return addListHtml;
		}

		//去掉系统推荐学霸中重复的数据
		function avoidDuplication(data, xbData){
			var xbData = xbData;
			for(var i = 0; i < data.length; i ++){
				if(!xbData.length){break;}
				for(var j = 0; j < xbData.length; j ++){
					if(data[i].destUserInfo.userBasicInfo.userId == xbData[j].userId){
						xbData.splice(j,1);
						break;
					}
				}
			}
			return xbData;
		}

		function getData(){
			var $target = $("#addFollowing .af_it").eq(cur);
			var userId = $target.attr("userId"),
				name = $target.find('span').html();
			key = "";
			if(settings.addUser && len){
				settings.addUser(userId,name);
			}
		}

		function remove(){
			$("#addFollowing").remove();
			$("body").unbind("click",remove);
		}
		
		return this;
	}
	
})(jQuery, window, document);