// digits.js
var digits=function(n,m,b){ // convert integer n to m digits of number base b
	b=b||10, n=n.toString(b); return '0000000000'.substr(0,m-n.length)+n;
}
module.exports=digits;