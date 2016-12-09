/* 
Publisher.listen("loginSuccess",funcCb);绑定登录成功事件函数funcCb，可绑定多个
Publisher.listen("loginFail",funcCb);绑定登录失败事件函数funcCb，可绑定多个
Publisher.listen("vaildFail",funcCb);绑定验证登录数据合理性函数funcCb，可绑定多个
Publisher.listen("logoutSuccess",funcCb);绑定登出成功事件函数funcCb，可绑定多个
Publisher.removeListen(ev);接触绑定的事件（如"vaildFail"）;
如果要移除某个事件的某个函数，则在绑定的时候加上赋值：
	funcCb = Publisher.listen("loginSuccess",funcCb);
	移除：Publisher.removeListen("loginSuccess",funcCb);
登录：
_log.login(id,psw.auto);
登出：
_log.logout();
 */

//var qa_domain = "http://www.pje-qa.com/";

var Publisher = {
	_o : $({}),
	//添加监听者
	listen : function(ev,func){
		var func1 = function(){
			//屏蔽掉jQuery默认的第一个event对象参数
			func.apply(this, [].slice.call(arguments,1));
		};
		this._o.bind(ev,func1);
		return func1;
	},
	//发布事件&数据
	fire : function(){
		this._o.trigger.apply(this._o,arguments);
	},
	//移除监听
	removeListen : function(ev,func){
		this._o.unbind(ev,func);
	}
};

var LOG = function(id,psw,auto){
	var login_url = qa_domain + "login2.json";
	var logout_url = qa_domain + "logout.json";
	var login_url_em = qa_domain + "uc/loginByMail.json";
	var userInfo_url = qa_domain + "myinfo.json";
	var _cookie = "UUID_TOKEN";
	var _id = id||'',_psw = psw?psw:'',_auto=auto||false; //要加密
	var lock = false;
	var dd_reg = /^\d{4,}$/;
	var psw_reg = /^.{6,16}$/;
	var email_reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	
	function login(id,psw,auto){
		if(lock){
			Publisher.fire("validFail","正在登录中...");
			return false;
		}else{
			lock = true;
		}
		if(id || psw || auto){
			setData(id,psw,auto);
		}
		var validData = valid();
		if(!validData.result){
			Publisher.fire("validFail",validData.data);
			lock = false;
			return;
		}
		if (dd_reg.test(_id)) {
			var param = {
				"account": _id,
			    "pwd": hex_md5(_psw),
			    "auto":_auto
			};
			var LOGurl = login_url;
		}else if (email_reg.test(_id)) {
			var param = {
				"email": _id,
			    "pwd": hex_md5(_psw),
			    "auto":_auto
			};
			var LOGurl = login_url_em;
		};
		
		$.post(LOGurl + "?" +(new Date().getTime()+Math.floor(Math.random()*1000)),param,function (data) {
			var code = +data["resultCode"].code,
			errorTips = data["resultCode"].detail;
			if(code == 0){
				getUserInfo(function(data){
					Publisher.fire("loginSuccessBf",data); //异步登陆后首先要初始化的在这里fire
					Publisher.fire("loginSuccess",data);
					Publisher.fire("loginSuccessCb",data);
					lock = false;
				},function(data){
					Publisher.fire("loginFail",data.resultCode.detail);
					lock = false;
				});
				if ($.cookie) {
					if (_auto) {
						$.cookie("duoduoId_alias",_id,{expires:7,domain:".7wenta.com",path:"/"});
					}else{
						$.cookie("duoduoId_alias",null);
						$.cookie("pwd_alias",null);
					}
				};
			}else{
				Publisher.fire("loginFail",errorTips);
				lock = false;
			}
		});
	}
	
	function logout(){
		$.post(logout_url,function (data) {
			_id = "";
			_psw = "";
			_auto = false;
			Publisher.fire("logoutSuccess",data);
		},"json");
	}
	
	function getUserInfo(sucCb,failCb){
		if(!sucCb || !typeof(sucCb)=="function"){
			sucCb = function(){};
		}
		if(!failCb || !typeof(failCb)=="function"){
			failCb = function(){};
		}
		$.post(userInfo_url + "?" +(new Date().getTime()+Math.floor(Math.random()*1000)),function(data){
			if(data.resultCode.code == 0){
				sucCb(data);
				Publisher.fire("getUserInfoSuccess",data);
			}else{
				failCb(data);
				Publisher.fire("getUserInfoFail",data);
			}
		});
	}
	
	function setData(id,psw,auto){
		_id = id || '';
		_psw = psw ? psw : '';
		_auto = auto || false;
	}

	function valid(){		
		if(_id == "" || _psw == ""){
			return {result : false , data : "多多号/邮箱或者密码为空！"};
		}else if((!(email_reg.test(_id)) && !(dd_reg.test(_id))) || !(psw_reg.test(_psw))){
			return {result : false , data : "多多号/邮箱或密码错误！"};
		}else{
			return {result : true};
		}
	}

	window.getUserInfo = getUserInfo;
	
	return{
		Login : login,
		Logout : logout
	}
}

var _log = new LOG();

//登录弹出框
var popLogin = function(opts){
	var _defaults = {
		submitSuccessCallback : function(){},
		close : function(){},
		after : function(){}
	};
	this.settings = $.extend({},_defaults,opts);

	this.accoutBox = '<div id="accoutBoxWrp">\
						  <div id="acSuoping"></div>\
						  <div id="accoutBox">\
							<div class="acBox_hd pr clearfix"></div>\
							<div class="acBox_bd pr">\
								<div class="acBox_tt pr">\
									<div class="acBox_logo accout_bg"></div>\
									<div class="acBox_switch clearfix pr">\
										<div class="acBox_switch_l l clearfix on"><span class="acBox_switch_icn l accout_bg"></span><span class="acBox_switch_txt l">申请多多号</span></div>\
										<div class="acBox_switch_r r clearfix"><span class="acBox_switch_icn l accout_bg dib"></span><span class="acBox_switch_txt l">申请教师号</span></div>\
										<div class="acBox_switch_line pa"></div>\
									</div>\
									<a href="###" id="accountBox_close" class="accout_bg pa" target="_self"></a>\
								</div>\
								<div id="loginBox" class="pr">\
									<div class="lg_cont">\
										<form method="post" id="loginForm">\
											<div id="errorWrp"><div id="error" class="clearfix hide"><span class="errorIcn accout_bg"></span><span class="errorTxt"></span></div></div>\
											<div id="loginName" class="reForm regInputlWrp clearfix">\
												<div class="regInputCnt pr l clearfix accout_bg">\
													<input id="loginBox_name" class="regInput cS" type="text" name="duoduoID" tabindex="1"value="">\
													<div class="regInputRt pa accout_bg"></div>\
													<div class="regInputTip pa accout_bg">请输入多多号/手机号/邮箱<div class="regInputRt pa accout_bg"></div></div>\
													<div class="regInputIcn pa accout_bg regInputIcn_nm"></div>\
													<div class="regInputClear pa accout_bg"></div>\
												</div>\
											</div>\
											<div id="loginPwd" class="reForm regInputlWrp clearfix">\
												<div class="regInputCnt pr l clearfix accout_bg">\
													<input id="loginBox_pass" class="regInput cS" class="accout_bg" type="password" name="duoduopass" tabindex="2" value="">\
													<div class="regInputRt pa accout_bg"></div>\
													<div class="regInputIcn pa accout_bg regInputIcn_pwd"></div>\
													<div class="regInputTip pa">密码<div class="regInputRt pa accout_bg"></div></div>\
													<div class="regInputClear pa accout_bg"></div>\
												</div>\
											</div>\
											<div id="loginInfo" class="clearfix">\
												<div id="loginBox_checkbox" data-auto="true" class="l clearfix">\
													<div class="loginBox_checkbox loginBox_checkbox_hv clearfix accout_bg l"></div>\
													<label class="l">下次自动登录</label>\
												</div>\
												<a class="r" target="_blank" href="http://account.7wenta.com/getbackpwd/getBackPwd.action?action=toinput&amp;duoduoId=0">忘记密码？</a>\
											</div>\
											<a id="loginBox_submit" class="accout_bg" href="###" tabindex="3">去问他</a>\
											<div class="loginBox_state">没有多多号？<a class="register" href="###">立即注册!</a></div>\
										</form>\
									</div>\
								</div>\
								<div id="registerBox" class="pr">\
									<div id="registerPre">\
										<div id="regZone"></div>\
										<div id="regAgree" class="clearfix">\
											<div id="regAgree1" data-agree="true" class="regAgree clearfix">\
												<div class="regAgree-check acCheckBox acCheckBox_hv accout_bg l"></div>\
												<a class="l" href="http://www.7wenta.com/jst/WentaAgreement_web.html" target="_blank">我同意问他用户服务及问他软件使用协议</a>\
											</div>\
											<div id="regAgree2" data-agree="true" class="regAgree clearfix">\
												<div class="regAgree-check acCheckBox acCheckBox_hv accout_bg l"></div>\
												<a class="l" href="http://account.7wenta.com/appid/commitment.html" target="_blank">我同意健康上网承诺书</a>\
											</div>\
										</div>\
										<a href="###" id="registerSubmit" class="acSureButton accout_bg">快速注册</a>\
										<div class="regTip">\
											已有多多号？赶紧 <a href="###" id="regLogin" class="reg-lk">[登录]</a> 吧！\
										</div>\
									</div>\
									<div id="registerAfter">\
										<div id="regSucessHd">申请成功</div>\
										<div id="regUserInfo">\
											<div id="RegDuoduoId" class="clearfix">\
												<span class="key l">多多号：</span><span class="value l"></span>\
												<object id="saveDDFlash" class="saveDDFlashObj" type="application/x-shockwave-flash" data="http://www.7wenta.com/resource/flash/savetext_reg.swf" width="70" height="24">\
													<param name="movie" value="http://www.7wenta.com/resource/flash/savetext_reg.swf">\
													<param name="quality" value="high">\
													<param name="menu" value="false">\
													<param name="allowScriptAccess" value="always">\
													<param name="wmode" value="transparent">\
													<param name="flashvars" value="">\
												</object>\
											</div>\
											<div id="RegPwd" class="clearfix">\
												<span class="key l">密&nbsp;&nbsp;码：</span><span class="value l"></span>\
											</div>\
										</div>\
										<a href="###" id="registerSucess" class="acSureButton accout_bg">去问他</a>\
										<div class="regTip"><span class="regTip-title">小提示</span>：如果想让你的多多号更加安全，赶快去设置设置<a id="passProtectLink" class="reg-lk" href="###" target="_blank">密码保护</a></div>\
									</div>\
									<div id="registerAfterEm">\
										<div id="regSucessHd">申请成功</div>\
										<div id="regUserInfo">\
											<div id="regEmailInfo">\
												<div class="regEmCnt">\
													<p>验证邮件已发送到<span id="regEmailNm">XXX@qq.com</span>，</p>\
													<p>您需要点击邮件中的确认链接来完成注册激活</p>\
												</div>\
												<div class="regEmInfo">没有收到邮件？<a id="reSendEmLk" href="">重新发送</a></div>\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>\
							<div class="acBox_ft"></div>\
						</div>\
					</div>';
	this.normalReg = '<div id="regPwd" class="reForm regInputlWrp clearfix">\
							<label for="regPwd-input" class="l">*密码：</label>\
							<div class="regInputCnt pr l clearfix accout_bg">\
								<input id="regPwd-input" type="password" class="regInput cS regInputl" maxlength="18" type="text"/>\
								<div class="regInputRt pa accout_bg"></div>\
								<div class="regInputTip pa accout_bg">密码是由6-16个字符组成的哦~<div class="regInputRt pa accout_bg"></div></div>\
							</div>\
						</div>\
						<div id="reRegPwd" class="reForm regInputlWrp clearfix">\
							<label for="reRegPwd-input" class="l">*确认密码：</label>\
							<div class="regInputCnt pr l clearfix accout_bg">\
								<input id="reRegPwd-input" type="password" class="regInput cS regInputl" maxlength="18" type="text"/>\
								<div class="regInputRt pa accout_bg"></div>\
								<div class="regInputTip pa accout_bg">请再次输入上面的密码<div class="regInputRt pa accout_bg"></div></div>\
							</div>\
						</div>\
						<div id="regVerify" class="reForm regInputsWrp clearfix">\
							<label for="regVerify-input" class="l">验证码：</label>\
							<div class="regInputWrp pr l clearfix">\
								<div class="regInputCnt pr l clearfix accout_bg">\
									<input id="regVerify-input" class="regInput cS regInputs" maxlength="6" type="text"/>\
									<div class="regInputRt pa accout_bg"></div>\
								</div>\
								<div id="regVerifyCode" class="l clearfix">\
									<img id="regVerifyImg" class="l" src="###" />\
									<a href="###" id="regVerifyChange" class="reg-lk l">换一张</a>\
								</div>\
							</div>\
						</div>';
	this.teacherReg = '<div id="regRelName" class="reForm regInputmWrp clearfix">\
							<label for="regRelName-input" class="l">*真实姓名：</label>\
							<div class="regInputCnt pr l clearfix accout_bg">\
								<input type="text" maxlength="18" class="regInput cS regInputl" type="text" id="regRelName-input"/>\
								<div class="regInputRt pa accout_bg"></div>\
								<div class="regInputTip pa accout_bg">请输入真实姓名<div class="regInputRt pa accout_bg"></div></div>\
							</div>\
						</div>\
						<div id="regPwd" class="reForm regInputlWrp clearfix">\
							<label for="regPwd-input" class="l">*密码：</label>\
							<div class="regInputCnt pr l clearfix accout_bg">\
								<input type="password" maxlength="18" class="regInput cS regInputl" type="text" id="regPwd-input"/>\
								<div class="regInputRt pa accout_bg"></div>\
								<div class="regInputTip pa accout_bg">密码是由6-16个字符组成的哦~<div class="regInputRt pa accout_bg"></div></div>\
							</div>\
						</div>\
						<div id="reRegPwd" class="reForm regInputlWrp clearfix">\
							<label for="reRegPwd-input" class="l">*再次输入密码：</label>\
							<div class="regInputCnt pr l clearfix accout_bg">\
								<input type="password" maxlength="18" class="regInput cS regInputl" type="text" id="reRegPwd-input"/>\
								<div class="regInputRt pa accout_bg"></div>\
								<div class="regInputTip pa accout_bg">请再次输入上面的密码<div class="regInputRt pa accout_bg"></div></div>\
							</div>\
						</div>\
						<div id="regEmail" class="reForm regInputlWrp clearfix">\
							<label for="regEmail-input" class="l">*邮箱：</label>\
							<div class="regInputCnt pr l clearfix accout_bg">\
								<input type="text" maxlength="180" class="regInput cS regInputl" type="text" id="regEmail-input"/>\
								<div class="regInputRt pa accout_bg"></div>\
								<div class="regInputTip pa accout_bg">请输入邮箱<div class="regInputRt pa accout_bg"></div></div>\
							</div>\
						</div>\
						<div id="regVerify" class="reForm regInputsWrp clearfix">\
							<label for="regVerify-input" class="l">验证码：</label>\
							<div class="regInputWrp pr l clearfix">\
								<div class="regInputCnt pr l clearfix accout_bg">\
									<input id="regVerify-input" class="regInput cS regInputs" maxlength="6" type="text"/>\
									<div class="regInputRt pa accout_bg"></div>\
								</div>\
								<div id="regVerifyCode" class="l clearfix">\
									<img id="regVerifyImg" class="l" src="###" />\
									<a href="###" id="regVerifyChange" class="reg-lk l">换一张</a>\
								</div>\
							</div>\
						</div>';
	this.$accoutBoxElm = $(this.accoutBox);
	this.$loginBoxElm = this.$accoutBoxElm.find("#loginBox");
	this.$registerBoxElm = this.$accoutBoxElm.find("#registerBox");
	this.init();
}
popLogin.prototype.loginModule = function(){
	$loginBox = this.$loginBoxElm;
	var _self = this;

	if ($.cookie) {
		if ($.cookie("duoduoId_alias")) {
			$loginBox.find("#loginBox_name").val($.cookie("duoduoId_alias")).closest('.reForm').find(".regInputTip").hide();
		};
		if ($.cookie("pwd_alias")) {
			$loginBox.find("#loginBox_pass").val($.cookie("pwd_alias")).closest('.reForm').find(".regInputTip").hide();
		};
	};

	/*var autofillCount = 0;
	var autofillInterval;
	if(navigator.userAgent.toLowerCase().indexOf("chrome")>=0){
		autofillInterval = setInterval(function(){
			$('input:-webkit-autofill').each(function(){
				var clone = $(this).clone(true,true);
				$(this).after(clone).remove();
			});
			autofillCount++;
			if (autofillCount >= 1000) {
				clearInterval(autofillInterval);
			};
		},0);		
	}*/
	Publisher.removeListen("loginSuccessCb");
	Publisher.listen("loginSuccess",showSuccess);
	Publisher.listen("loginSuccessCb",_self.settings.submitSuccessCallback);

	$loginBox.find("#loginBox_submit").bind("click",function() {
		var name = $.trim($loginBox.find("#loginBox_name").val());
		var pwd = $loginBox.find("#loginBox_pass").val();
		var auto = $loginBox.find("#loginBox_checkbox").data("auto");
		Publisher.removeListen("validFail");
		Publisher.removeListen("loginFail");
		Publisher.listen("validFail",showError);
		Publisher.listen("loginFail",showError);
		_log.Login(name,pwd,auto);
		function showError(data){
			$loginBox.find("#loginBox_pass,#loginBox_name").blur();
			$loginBox.find("#error").show().find(".errorTxt").html(data);
		};
		return false;
	});
	
	// 登陆提交按钮
	$loginBox.find("#loginBox_submit").bind("keydown",function(e){
		if(e.which == 9){
			$loginBox.find("#loginBox_name").attr("TabIndex",4);
		}
	});

	// 自动登陆
	$loginBox.find("#loginBox_checkbox").click(function() {
		var that = $(this);
		if (that.data("auto")) {
			that.data("auto",false);
			that.find(".loginBox_checkbox").removeClass("loginBox_checkbox_hv");
		}else{
			that.data("auto",true);
			that.find(".loginBox_checkbox").addClass("loginBox_checkbox_hv");
		}
	});

	// 清除按钮和input提示层
	$loginBox.on("click",".regInputClear,.regInputTip",function(){
		var that = $(this);
		var parent = that.closest('.reForm');
		that.hide();
		parent.find('.regInput').val("").focus();
		return false;
	});

	// 多多号/密码输入框
	$loginBox.find(".regInput").bind("keyup",function(){
		var that = $(this);
		checkClear(that);
	}).bind("blur",function(){
		var that = $(this);
		var parent = that.closest('.reForm');
		parent.removeClass("focus");
		checkClear(that);
	}).bind("focus",function(){
		var that = $(this);
		var parent = that.closest('.reForm');		
		parent.addClass("focus");
		parent.find(".regInputTip").hide();
		$loginBox.find("#error").hide();
	}).bind("keydown",function(e){
		if (e.keyCode == 13) {
			$loginBox.find("#loginBox_submit").trigger('click');
		};
	});;	

	function checkClear(elem){
		var parent = elem.closest('.reForm');
		if(parent.find(".regInput").val().length == 0){
			parent.find(".regInputClear").hide();
			parent.find(".regInputTip").show();
		}else{
			parent.find(".regInputClear").show();
			parent.find(".regInputTip").hide();
		}
	}
	function showSuccess(data){
		_self.hideLogin();
	};
}
popLogin.prototype.registerModule = function(){
	var _self = this;
	$accoutBox = this.$accoutBoxElm;
	$loginBox = this.$loginBoxElm;
	$regBox = this.$registerBoxElm;

	$regBox.on("click",".regInputTip",function(){
		var that = $(this);
		var parent = that.closest('.reForm');
		that.hide();
		parent.find(".regInput").val("").focus();
	});
	$regBox.on("blur",".regInput",function(){
		var that = $(this);
		var parent = that.closest('.reForm');
		var id = parent.attr("id");
		parent.removeClass("focus error");
		if (that.val() == '') {
			parent.find(".regInputTip").show();
		};
	}).on("focus",".regInput",function(){
		var that = $(this);
		var parent = that.closest('.reForm');
		parent.addClass("focus");
		parent.find(".regInputTip").hide();
		hideErrorTip(parent);
	});
	$regBox.find(".regAgree-check").toggle(function(){
		var that = $(this);
		that.closest(".regAgree").data("agree",false).find(".acCheckBox").removeClass("acCheckBox_hv");		
	},function(){
		var that = $(this);
		that.closest(".regAgree").data("agree",true).find(".acCheckBox").addClass("acCheckBox_hv");
	});

	$regBox.on("click","#regVerifyChange",function(){
		regVerifyChange();
		return false;
	});
	function regVerifyChange(){
		$regBox.find("#regVerifyImg").attr("src",qa_domain+'captcha4Reg.json?'+(new Date().getTime()));
	}
	regVerifyChange();

	$regBox.on("focus","#regVerify .regInput",function(){
		hideErrorTip($("#regVerify"));
		return false;
	}).on("keydown","#regVerify .regInput",function(e){
		if (e.keyCode == 13) {
			$regBox.find("#registerSubmit").trigger("click");
		};
	});
	$regBox.on("click","#registerSubmit",function(){
		if ($regBox.data("regType") == "normal") {
			if (verifyRegisterPWD()) {
				var pwd = hex_md5($("#regPwd .regInput").val());
				var challenge = $.trim($("#regVerify .regInput").val());
				var ajaxRegisterUrl = 'http://www.7wenta.com/zhuce.json';			
				$.post(ajaxRegisterUrl,{challenge:challenge,pwd:pwd},function(data){
					var result = data.result;
					if (result.resultCode.code == 0) {
						$regBox.find("#registerPre").hide();
						$regBox.find("#registerAfter").show();
						$accoutBox.removeClass('registering');
						window.regDuoduoId = result.value.duoduoId;
						window.regPassword = $("#regPwd .regInput").val();
						$regBox.find("#RegDuoduoId .value").html(window.regDuoduoId);
						$regBox.find("#RegPwd .value").html(window.regPassword);
						$regBox.find("#passProtectLink").attr("href",'http://account.7wenta.com/pwdprotect/accountSafeInfo.action?duoduoId='+regDuoduoId);
					}else if(result.resultCode.code == -4){
						showErrorTip($("#regVerify"),'请输入正确的验证码');
					}else if(result.resultCode.code == -11){
						regVerifyChange();
						showErrorTip($("#regVerify"),'验证码已过期，请重新输入');
					}
				});
			}
		}else if ($regBox.data("regType") == "teacher") {
			if (verifyRegisterPWDEmail()) {
				var pwd = hex_md5($("#regPwd .regInput").val());
				var challenge = $.trim($("#regVerify .regInput").val());
				var name = $.trim($("#regRelName .regInput").val());
				var email = $.trim($("#regEmail .regInput").val());
				var ajaxRegisterUrl = 'http://www.7wenta.com/registerTeacherUser.json';
				$.post(ajaxRegisterUrl,{challenge:challenge,pwd:pwd,name:name,email:email},function(data){
					var result = data.result;					
					if (result.resultCode.code == 0) {
						var email = result.value.email;
						var uuid = result.value.uuid;
						$regBox.find("#regEmailNm").html(email);
						$regBox.find("#registerPre").hide();
						$regBox.find("#registerAfterEm").show();
						$accoutBox.removeClass('registering');
						$regBox.find("#reSendEmLk").data("count",0);
						$regBox.find("#reSendEmLk").click(function(){
							var that = $(this);							
							var actionUrl = qa_domain + 'uc/reSendRegisterEmail.json';
							if (that.data("count") < 3) {
								$regBox.find("#reSendInfo").remove();
								$.post(actionUrl,{uuid:uuid,email:email},function(data){
									if (data.result.resultCode.code == 0) {
										var infoTip = '<div style="font-size:12px;color:red;" id="reSendInfo">验证邮件已经发送成功，请查收...</div>';
										var $infoTip = $(infoTip);
										$infoTip.appendTo($regBox.find(".regEmInfo"));
										setTimeout(function(){
											$infoTip.fadeOut(500).remove();
										},2000);
										var count = that.data("count");
										that.data("count",++count);
									}
								});
							}else{
								$regBox.find("#reSendInfo,#reSendInfo_2").remove();
								var infoTip = '<div style="font-size:12px;color:red;" id="reSendInfo_2">验证邮件已经超过3次了哦，去邮箱看看呗~</div>';
								var $infoTip = $(infoTip);
								$infoTip.appendTo($regBox.find(".regEmInfo"));
								setTimeout(function(){
									$infoTip.fadeOut(500).remove();
								},2000);
							}
							return false;
						});
					}else if(result.resultCode.code == -11){
						regVerifyChange();
						showErrorTip($("#regVerify"),'验证码已过期，请重新输入');
					}else{
						showErrorTip($("#regVerify"),result.resultCode.detail);
					}
				});
			}
		}
		// return false;
	});
	$regBox.on("click","#registerSucess",function(){
		var name = $.trim($regBox.find("#RegDuoduoId .value").text());
		var pwd = $regBox.find("#RegPwd .value").text();
		var auto = true;
		_log.Login(name,pwd,auto);
		return false;
	});

	function verifyRegisterPWD(){
		var regPwd = $.trim($("#regPwd .regInput").val());
		var reRegPwd = $.trim($("#reRegPwd .regInput").val());
		var challenge = $.trim($("#regVerify .regInput").val());		
		if ($("#regAgree1").data("agree") && $("#regAgree2").data("agree")) {
			if (verifyRegPwd()) {
				if (verifyReRegPwd()) {
					if (challenge == "") {
						showErrorTip($("#regVerify"),'请输入正确的验证码');
					}else{
						return true;
					}
				};
			};
		}
		return false;
	}

	function verifyRegisterPWDEmail(){
		var regPwd = $.trim($("#regPwd .regInput").val());
		var reRegPwd = $.trim($("#reRegPwd .regInput").val());
		var challenge = $.trim($("#regVerify .regInput").val());		
		if ($("#regAgree1").data("agree") && $("#regAgree2").data("agree")) {
			if (verifyRegRelname()) {
				if (verifyRegPwd()) {
					if (verifyReRegPwd()) {
						if (verifyRegEmail()) {
							if (challenge == "") {
								showErrorTip($("#regVerify"),'请输入正确的验证码');
							}else{
								return true;
							}
						}
					};
				};
			};
			
		}
		return false;
	}
	// 验证密码
	function verifyRegPwd(){
		var regPwd = $.trim($("#regPwd .regInput").val());
		var pwd_reg = /^[a-zA-Z0-9_]{6,16}$/;
		var weakInstance = new WeakPasswordChecker();
		if (regPwd == "") {
			showErrorTip($("#regPwd"),'请先输入密码');
		}else{
			if (!pwd_reg.test(regPwd)) {
				showErrorTip($("#regPwd"),'请输入6-16位密码');
			}else if(weakInstance.isWeak(regPwd)){
				showErrorTip($("#regPwd"),'你输入的密码太简单了~');
			}else{
				return true;
			}
		}
		return false;
	}
	// 验证再次输入密码
	function verifyReRegPwd(){
		var regPwd = $.trim($("#regPwd .regInput").val());
		var reRegPwd = $.trim($("#reRegPwd .regInput").val());
		if (reRegPwd == "") {
			showErrorTip($("#reRegPwd"),'请重新输入密码');
		}else{
			if (regPwd !== reRegPwd) {
				showErrorTip($("#reRegPwd"),'请输入相同密码');
			}else{
				return true;
			}
		}
		return false;
	}
	// 验证邮箱
	function verifyRegEmail(){
		var regEmail = $.trim($("#regEmail .regInput").val());
		var email_reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if (regPwd == "") {
			showErrorTip($("#regEmail"),'请输入注册邮箱');
		}else{
			if (!email_reg.test(regEmail)) {
				showErrorTip($("#regEmail"),'邮箱格式不准确');
			}else{
				return true;
			}
		}
		return false;
	}
	// 验证真实姓名
	function verifyRegRelname(){
		var regRelName = $.trim($("#regRelName .regInput").val());
		if (regRelName == "") {
			showErrorTip($("#regRelName"),'请输入真实姓名');
		}else{
			if (_relNameRule(regRelName).code != 0) {
				showErrorTip($("#regRelName"),_relNameRule(regRelName).detail);
			}else{
				return true;
			}
		}
		function relNameRule(o){
			function getByteLen(str){
				var len = 0;
				for(i=0; i<str.length; i++){
					len += (str.charCodeAt(i)>256)?2:1;
			 	}
				return len;
			} 
			if (getByteLen(o)<=16 && getByteLen(o)>0) {
				return true;
			};
			return false;
		}
		function _relNameRule(val){//检测昵称的长度
			if(!val){
				return {code:-3,detail:'名字不能为空哦~'};
			}else{
				var l = 0;
				for(var i = 0;i < val.length; i ++){
					if(val.charCodeAt(i) < 0 || val.charCodeAt(i) > 255){
						l += 2;
					}else{
						l ++;
					}
				}
				if(l < 4 || l > 14){
					return {code:-2,detail:'名字长度为4-14位字母或2-7位中文字符'};
				}else{
					var pattern = new RegExp(/^[\w\u4e00-\u9fa5]+$/gi);
					if(pattern.test(val)){
						return {code:0,detail:'名字格式正确'};
					}else{
						return {code:-1,detail:'名字只能使用数字、字母、中文和下划线'};
					}
				}
			}
		}
		return false;
	}
	function showErrorTip(elem,txt){
		var errorTip = '<div class="regErrorTIp pa"><span class="regErrorTxt">'+ txt +'</span><span class="regErrorRt pa"></span></div>';
		var $errorTip = $(errorTip);
		$accoutBox.find('.regErrorTIp').remove();
		elem.addClass('error');
		$errorTip.appendTo(elem.find('.regInputCnt')).css({width:widthGetter(txt)+5});

		function widthGetter(word){
			var togetDIV = '<span>'+ word +'</span>';
			var $togetDIV = $(togetDIV);
			var width = $togetDIV.appendTo($("body")).outerWidth();
			$togetDIV.remove();
			return width;
		}
	}
	function hideErrorTip(elem){
		$accoutBox.find('.reForm').removeClass('error');
		$accoutBox.find('.regErrorTIp').remove();
		// elem.find('.regInputCnt .regErrorTIp').remove();
	}
}
popLogin.prototype.accountModule = function(){
	var _self = this;
	$accoutBox = this.$accoutBoxElm;
	$loginBox = this.$loginBoxElm;
	$regBox = this.$registerBoxElm;

	//关闭登录框
	$accoutBox.find("#accountBox_close").click(function () {
		_self.hideLogin();
		_self.settings.close();
		return false;
	});
	$accoutBox.find(".loginBox_state .register").click(function(){
		shuffleToNormal_reg();
		$loginBox.hide();
		$regBox.show();
		// return false;
	});
	$accoutBox.find("#regLogin").click(function(){
		$loginBox.show();
		$regBox.hide();
		$accoutBox.removeClass('registering');
		return false;
	});
	$accoutBox.find(".acBox_switch_l").click(function(){
		var that = $(this);
		$accoutBox.find(".acBox_switch_l,.acBox_switch_r").removeClass('on');
		that.addClass('on');
		shuffleToNormal_reg();
		return false;
	});
	$accoutBox.find(".acBox_switch_r").click(function(){
		var that = $(this);
		shuffleToTeacher_reg();
		return false;
	});
	
	function shuffleToNormal_reg(){
		$accoutBox.find("#regZone").empty().append(_self.normalReg);
		$regBox.data("regType","normal");
		$accoutBox.find(".acBox_switch_line").animate({left:'0px'},200);
		$accoutBox.find(".acBox_switch_l,.acBox_switch_r").removeClass('on');
		$accoutBox.find(".acBox_switch_l").addClass('on');
		shuffleCommon();
	}
	function shuffleToTeacher_reg(){
		$accoutBox.find("#regZone").empty().append(_self.teacherReg);
		$regBox.data("regType","teacher");
		$accoutBox.find(".acBox_switch_line").animate({left:'160px'},200);
		$accoutBox.find(".acBox_switch_l,.acBox_switch_r").removeClass('on');
		$accoutBox.find(".acBox_switch_r").addClass('on');
		shuffleCommon();
	}
	function shuffleCommon(){
		$loginBox.hide();
		$regBox.show();
		$regBox.find("#regVerifyChange").click();
		$loginBox.find("#error").empty();
		$accoutBox.addClass('registering');
	}

	$accoutBox.appendTo("body");
	$accoutBox.find("#acSuoping").css({
		height : $(document).height()
	})
	Publisher.fire('showLogin');
	// $('<iframe frameborder="0"></iframe>').css('height',$(document).height()).prependTo($accoutBox);
	_self.settings.after();

}
popLogin.prototype.init = function(){
	var _self = this;
	this.loginModule();
	this.registerModule();
	this.accountModule();
}
popLogin.prototype.hideLogin = function(){
	var $accoutBox = this.$accoutBoxElm;
	$accoutBox.remove();
	Publisher.fire('hideLogin');
}
popLogin.prototype.showLogin = function(){
	var $accoutBox = this.$accoutBoxElm;
	var _self = this;
	_self.init();
}

//登出函数
function logoutCb(){
	Publisher.removeListen("logoutSuccess");
	Publisher.listen("logoutSuccess",function(data){
		window.location.reload();
	});
}
logoutCb();

/**
 * 下面验证代码来自客服支撑
 */
//封装了私有变量/提供公共接口isWeak()
//调用方法 var instance=new WeakPasswordChecker()
//              instance.isWeak("passwordStrings")

var WeakPasswordChecker = function () {
	this.isWeak = function (s) {
		if (containLetter(s))
			return false;
		else if (passwordCheckRule_1(s) && passwordCheckRule_2(s) && passwordCheckRule_3(s) && passwordCheckRule_4(s)) {
			return false;
		} else
			return true;		
	}
	var containLetter = function (passWord) //判断是不是纯数字，是返回false，不是返回true
	{
		for (var i = 0; i < passWord.length; i++) {
			if (passWord.charAt(i) < "0" || passWord.charAt(i) > "9") {
				return true;
			}
		}
		return false;
	}	
	var passwordCheckRule_1 = function (passWord) //只包含一个数字，是返回false，不是返回true
	{
		var a = passWord.charAt(0);
		for (var i = 1; i < passWord.length; i++) {
			if (passWord.charAt(i) != a)
				return true;
		}
		return false;
	}	
	var passwordCheckRule_2 = function (passWord) //只包含两个数字，是返回false，不是返回true
	{
		var a = passWord.charAt(0);
		var index = 0;
		var j = 0;
		for (var i = 1; i < passWord.length; i++) {
			if (passWord.charAt(i) != a) {
				index = i;
				break;
			} else
				j = j + 1;
			if (j == (passWord.length - 1))
				return false;
		}
		for (var k = index + 1; k < passWord.length; k++) {
			if (passWord.charAt(k) != passWord.charAt(0) && passWord.charAt(k) != passWord.charAt(index))
				return true;
		}
		return false;
	}	
	var passwordCheckRule_3 = function (passWord) //升序，是返回false，不是返回true
	{
		var a = Number(passWord.charAt(0));
		if (a + passWord.length - 1 > 9)
			return true;
		else {
			for (var i = 1; i <= passWord.length - 1; i++) {
				if (Number(passWord.charAt(i)) != ++a)
					return true;
			}
			return false;
		}		
	}	
	var passwordCheckRule_4 = function (passWord) //降序，是返回false，不是返回true
	{
		var a = Number(passWord.charAt(0));
		if (passWord.length - a - 1 > 0)
			return true;
		else {
			for (var i = 1; i <= passWord.length - 1; i++) {
				if (Number(passWord.charAt(i)) != --a)
					return true;
			}
			return false;
		}		
	}	
}

/*保存多多号密码Flash*/
function getSaveData(){
	var content = '多多号:'+ regDuoduoId +'  密码:'+ regPassword +'\r\n\r\n\r\n\r\n'
	+'作业不会做？去问他！\r\n找试题，找试卷，做单元测试，去问他！\r\n\r\n问他是一个为中小学生量身定做的教育网站，有作业问题，只要在问他搜一搜，问一问，立即能够得到作业答案解析。\r\n去问他，你可以找到海量的试题，试卷，里面包含了详细的题目解析，帮助你巩固学习，提高成绩！去问他，你可以发挥学霸的力量，帮助其他人回答作业难题，显示你超凡的学习能力！\r\n还等神马？去问他吧！以后再也不用害怕作业难题了！';
	return content;
}
function getFileName(){
	return '问他学习小助手.txt';
}

$(function(){
	// new popLogin();
	//首页登出
	$("body").on("click",".logout",function(){
		_log.Logout();
		return false;
	});
	$("body").on("click",".loginBtn",function(){
		new popLogin();
		return false;
	});
});

