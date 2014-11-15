// digits.js
var digit32=function(n,m){ // convert integer n to m digits of number base 32
	var b=32, n=n.toString(b); return '0000000000'.substr(0,m-n.length)+n;
}
module.exports=digit32;