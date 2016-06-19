/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);


/***/ },

/***/ 9:
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(10);
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

/***/ },

/***/ 10:
/***/ function(module, exports) {

	/**
	 * Created by humorHan on 2016/6/17.
	 */
	module.exports = {
		baseUrl: "http://localhost:3000/html/demo/",
		//跳转页面，可以处理公用跳转逻辑
		redirectUrl: function(redirectUrl, fromUrl) {
			if (redirectUrl == "login.html") {
				window.location.href = this.baseUrl + redirectUrl;
			} else {
				if (this.getCookie("uname")) {
					window.location.href = this.baseUrl + redirectUrl;
				} else {
					window.location.href = this.baseUrl + "login.html";
				}
			}
		},
		//设置cookie
		setCookie: function(objName, objValue, objHours) {
			var str = objName + "=" + escape(objValue);
	
			if (objHours > 0) { //为0时不设定过期时间，浏览器关闭时cookie自动消失
				var date = new Date();
				var ms = objHours * 3600 * 1000;
				date.setTime(date.getTime() + ms);
				str += "; expires=" + date.toGMTString() + ";path=/";
			}
			document.cookie = str;
		},
		//获取cookie
		getCookie: function(objName) { //获取指定名称的cookie的值
			var arrStr = document.cookie.split("; ");
			for (var i = 0; i < arrStr.length; i++) {
				var temp = arrStr[i].split("=");
				if (temp[0] == objName) {
					return unescape(temp[1]);
				}
			}
		},
		// html转码
		htmlEncode: function(s) {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(s));
			return div.innerHTML;
		},
		// html解码
		htmldecode: function(s) {
			var div = document.createElement('div');
			div.innerHTML = s;
			return div.innerText || div.textContent;
		}
	}

/***/ }

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGY0YjQ5NTY1OWY1Y2M1YTY3YWY/ZDI1YSoqKioiLCJ3ZWJwYWNrOi8vLy4vanMvbG9naW4uanMiLCJ3ZWJwYWNrOi8vLy4vZGVwL3V0aWwvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEsR0FBRTtBQUNGLEVBQUMsRTs7Ozs7OztBQ2pCRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxhQUFZLG9DQUFvQztBQUNoRDtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0EsZ0NBQStCO0FBQy9CLHdDQUF1QztBQUN2QyxrQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFIiwiZmlsZSI6ImxvZ2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA4ZjRiNDk1NjU5ZjVjYzVhNjdhZlxuICoqLyIsInZhciB1dGlsID0gcmVxdWlyZShcIi4uL2RlcC91dGlsL3V0aWxcIik7XHJcbiQoZnVuY3Rpb24oKSB7XHJcblxyXG5cdCQoXCIuYnRubG9naW5cIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdW5hbWUgPSAkKFwiI3VuYW1lXCIpLnZhbCgpO1xyXG5cdFx0dmFyIHVwd2QgPSAkKFwiI3Vwd2RcIikudmFsKCk7XHJcblxyXG5cdFx0aWYgKHVuYW1lID09ICd0ZXN0JyAmJiB1cHdkID09ICcxMjM0NTYnKSB7XHJcblx0XHRcdGFsZXJ0KCfnmbvlvZXmiJDlip8nKTtcclxuXHRcdFx0dXRpbC5zZXRDb29raWUoXCJ1bmFtZVwiLHVuYW1lKTtcclxuXHRcdFx0dXRpbC5yZWRpcmVjdFVybCgnaW5kZXguaHRtbCcsICdsb2dpbi5odG1sJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhbGVydCgn55So5oi35ZCN5a+G56CB6ZSZ6K+vJyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0fSlcclxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2pzL2xvZ2luLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSA1XG4gKiovIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgaHVtb3JIYW4gb24gMjAxNi82LzE3LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0YmFzZVVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvaHRtbC9kZW1vL1wiLFxyXG5cdC8v6Lez6L2s6aG16Z2i77yM5Y+v5Lul5aSE55CG5YWs55So6Lez6L2s6YC76L6RXHJcblx0cmVkaXJlY3RVcmw6IGZ1bmN0aW9uKHJlZGlyZWN0VXJsLCBmcm9tVXJsKSB7XHJcblx0XHRpZiAocmVkaXJlY3RVcmwgPT0gXCJsb2dpbi5odG1sXCIpIHtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmJhc2VVcmwgKyByZWRpcmVjdFVybDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0aGlzLmdldENvb2tpZShcInVuYW1lXCIpKSB7XHJcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB0aGlzLmJhc2VVcmwgKyByZWRpcmVjdFVybDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMuYmFzZVVybCArIFwibG9naW4uaHRtbFwiO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHQvL+iuvue9rmNvb2tpZVxyXG5cdHNldENvb2tpZTogZnVuY3Rpb24ob2JqTmFtZSwgb2JqVmFsdWUsIG9iakhvdXJzKSB7XHJcblx0XHR2YXIgc3RyID0gb2JqTmFtZSArIFwiPVwiICsgZXNjYXBlKG9ialZhbHVlKTtcclxuXHJcblx0XHRpZiAob2JqSG91cnMgPiAwKSB7IC8v5Li6MOaXtuS4jeiuvuWumui/h+acn+aXtumXtO+8jOa1j+iniOWZqOWFs+mXreaXtmNvb2tpZeiHquWKqOa2iOWksVxyXG5cdFx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdHZhciBtcyA9IG9iakhvdXJzICogMzYwMCAqIDEwMDA7XHJcblx0XHRcdGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIG1zKTtcclxuXHRcdFx0c3RyICs9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XHJcblx0XHR9XHJcblx0XHRkb2N1bWVudC5jb29raWUgPSBzdHI7XHJcblx0fSxcclxuXHQvL+iOt+WPlmNvb2tpZVxyXG5cdGdldENvb2tpZTogZnVuY3Rpb24ob2JqTmFtZSkgeyAvL+iOt+WPluaMh+WumuWQjeensOeahGNvb2tpZeeahOWAvFxyXG5cdFx0dmFyIGFyclN0ciA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdChcIjsgXCIpO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJTdHIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIHRlbXAgPSBhcnJTdHJbaV0uc3BsaXQoXCI9XCIpO1xyXG5cdFx0XHRpZiAodGVtcFswXSA9PSBvYmpOYW1lKSB7XHJcblx0XHRcdFx0cmV0dXJuIHVuZXNjYXBlKHRlbXBbMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHQvLyBodG1s6L2s56CBXHJcblx0aHRtbEVuY29kZTogZnVuY3Rpb24ocykge1xyXG5cdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0ZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHMpKTtcclxuXHRcdHJldHVybiBkaXYuaW5uZXJIVE1MO1xyXG5cdH0sXHJcblx0Ly8gaHRtbOino+eggVxyXG5cdGh0bWxkZWNvZGU6IGZ1bmN0aW9uKHMpIHtcclxuXHRcdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGRpdi5pbm5lckhUTUwgPSBzO1xyXG5cdFx0cmV0dXJuIGRpdi5pbm5lclRleHQgfHwgZGl2LnRleHRDb250ZW50O1xyXG5cdH1cclxufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9kZXAvdXRpbC91dGlsLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gNVxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=