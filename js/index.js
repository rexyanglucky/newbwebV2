// var mock =require("mock");


$(function() {
	setTimeout(function() {
		var arr = [0, 1, 3, 4, 5, 6];

		for (var i = 0; i < arr.length; i++) {
			var index = arr[i];
			$(".nav li:eq(" + index + ")").show();
		};
	}, 1000)

})