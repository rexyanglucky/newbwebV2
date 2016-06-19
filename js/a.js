//require('../css/common/base.css');
var Mock = require('mock');
console.log(Mock.Random.name());

var demoTpl = require('school/a.tpl');
var arr = [1,2,3,4,5,6];
$(".dom2").html(demoTpl(arr));