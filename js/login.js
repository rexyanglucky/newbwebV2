var util = require("../dep/util/util");
$(function() {

	$(".btnlogin").click(function() {
		var uname = $("#uname").val();
		var upwd = $("#upwd").val();

		if (uname == 'test' && upwd == '123456') {
			alert('登录成功');
			util.setCookie("uname",uname);
			util.redirectUrl('index.html', 'login.html');
		} else {
			alert('用户名密码错误');
			return false;
		}

	})
});