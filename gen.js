// gen.js 產生 中國古籍叢書目錄檢索 ccs 前置準備資料
// 產生   collnames.js 集名陣列    collnames[集序]=人名 coIndex -->  collName
// 產生  titlenames.js 書名陣列   titlenames[書序]=書名 tiIndex --> titleName
// 產生     authors.js 人名陣列      authors[人序]=人名 auIndex --> author
// 產生   titlecoll.js 書集陣列    titlecoll[書序]=集序 tiIndex --> [coIndex,...]
// 產生  authorcoll.js 人集陣列   authorcoll[人序]=集序 auIndex --> [coIndex,...]
var glob=require("glob"), fs=require("fs");
var target="components/ccs1-dataset/"; // 前置準備 工作資料夾
//var colls=require(target+"colls");
//console.log('1st try',colls.length);
var collinfo0=eval(fs.readFileSync(target+"colls.js",'utf8'));
// colls 前置處理 集訊陣列 colls[集序]=集訊
//console.log('2nd try',collinfo0.length);
var tiCount=0, tiName, tiIndex, ti={}; // tiCount 書名總數, tiName 書名, tiIndex 書名序號, ti[書名]=書名序號
var auCount=0, auName, auIndex, au={}; // auCount 人名總數, auName 人名, auIndex 人名序號, au[人名]=人名序號
var coCount=0, coName, coIndex 		 ; // coCount 集名總數, coName 集名, coIndex 集名序號
var collnames=[], collinfos=[], titlenames=[], authors=[], titlecoll=[], authorcoll=[];
var pb; // 廣錄頁碼 或 綜錄頁碼
var j; // 集名重複序號
var cj={}; // cj[集名]=集名重複序號
var file;
var M=0;
var coll='', colls=[];
var parseLineInfo=function(i,line) { // 逐行蒐集 相關集訊 ()
	line=line.replace(/<pb.+?="(.+?)"\/>/,function(m,m1){
		pb=file.charAt(0)+m1; // 廣錄頁碼 'g'+pb  綜錄頁碼 'z'+pb
		return ''
	});
	line=line.replace(/^　*<coll.*?>(.+?)<\/.+?>/,function(m,m1){
		if(coll)colls.push(coll),coll='';
		coName=m1; // 集名
		coIndex=coCount++;
		collinfo=collinfo0[coIndex];
		m=collinfo.match(/\n.*?<coll>(.+?)<\/.+?>/);
		if(m&&m[1]!==m1){
			console.log(i,file,coName,'not in collinfo0[',coIndex,']');
			console.log('collnames['+(coIndex-1)+']',collnames[coIndex-1]);
			console.log('collinfo0['+(coIndex-1)+']',collinfo0[coIndex-1].substr(0,200));
			console.log('collinfo0['+coIndex    +']',collinfo            .substr(0,200));
			console.log('collinfo0['+(coIndex+1)+']',collinfo0[coIndex+1].substr(0,200));
			exit;
		}
		j=cj[coName]||0, cj[coName]=j+1; // j 集名重複序號
		if(j)coName+=j;
		collinfo=collinfo.replace(/<coll>(.+?)<\/.+?>/,'<coll>'+coName+'</.+?>');
		collnames[coIndex]=coName; // *** 集名 (集名重複就加序號) 加入 集名陣列
		collinfos[coIndex]=pb+collinfo;
		var x=coIndex.toString(36); x='300'.substr(0,4-x.length)+x;
		return ';'+x+';';
	//	if(M++<3)console.log('collinfos['+coIndex+']',pb+coll);
	});
	line=line.replace(/<pr.*?>(.+?)<\/pr>/g,function(m,m1){
		author=m1; // 人名 (編者 或 著者)
		auIndex=au[author]; // 對應 人名序號+1
		if (!auIndex) { // 若無對應 人名序號+1
			authors[auCount]=author; // *** 人名 加入 人名陣列
			authorcoll[auCount]=[];
			au[author]=auIndex=++auCount; // 人名序號+1 (從 1 起算)
		}
		if(authorcoll[auIndex-1].indexOf(coIndex)<0)
			authorcoll[auIndex-1].push(coIndex);
		var x=(auIndex-1).toString(36); x='200'.substr(0,4-x.length)+x;
		return ';'+x+';';
	});
	line=line.replace(/<ti.*?>(.+?)<\/ti>/g,function(m,m1){
		tiName=m1; // 書名
		tiIndex=ti[tiName]; // 對應 書名序號+1
		if (!tiIndex) { // 若無對應 書名序號+1
			titlenames[tiCount]=tiName; // *** 書名 加入 書名陣列
			titlecoll[tiCount]=[];
			ti[tiName]=tiIndex=++tiCount; // 書名序號+1 (從 1 起算)
		}
		titlecoll[tiIndex-1].push(coIndex);
		var x=(tiIndex-1).toString(36); x='000'.substr(0,4-x.length)+x;
		return ';'+x+';';
	});
	if(coName)coll+=(coll?'\n':'')+line;
}
var convertfile=function(fn) {
	file=fn;
	var txt=fs.readFileSync(fn,"utf8");
	var L=txt.split(/\r?\n/);
	for(var i=0;i<L.length;i++){
		parseLineInfo(i,L[i]);
	}
}
var i, formats=function() {
	 collnames= collnames.map(JSON.stringify);
	   authors=   authors.map(JSON.stringify);
	titlenames=titlenames.map(JSON.stringify);
	 collinfos= collinfos.map(JSON.stringify);
	 titlecoll= titlecoll.map(JSON.stringify);
	authorcoll=authorcoll.map(JSON.stringify);
	     colls=     colls.map(JSON.stringify);
}
var finalize=function() {
	colls.push(coll);
	formats();
	fs.writeFileSync(target+ "collnames.js","module.exports=["+ collnames.join(",\n")+"]","utf8");
	console.log( "collnames.js", collnames.length);
	fs.writeFileSync(target+   "authors.js","module.exports=["+   authors.join(",\n")+"]","utf8");
	console.log(   "authors.js",   authors.length);
	fs.writeFileSync(target+"titlenames.js","module.exports=["+titlenames.join(",\n")+"]","utf8");
	console.log("titlenames.js",titlenames.length);
	fs.writeFileSync(target+ "collinfos.js","module.exports=["+ collinfos.join(",\n")+"]","utf8");
	console.log( "collinfos.js", collinfos.length);
	fs.writeFileSync(target+ "titlecoll.js","module.exports=["+ titlecoll.join(",\n")+"]","utf8");
	console.log( "titlecoll.js", titlecoll.length);
	fs.writeFileSync(target+"authorcoll.js","module.exports=["+authorcoll.join(",\n")+"]","utf8");
	console.log("authorcoll.js",authorcoll.length);
	
	fs.writeFileSync(target+    "xcolls.js","module.exports=["+     colls.join(",\n")+"]","utf8");
	console.log("    xcolls.js",     colls.length);
}
glob("guanglu/*.xml",function(err,files){
	files.map(convertfile,"g");
	glob("zonglu/*.xml",function(err,files2){
		files2.map(convertfile,"z");
		finalize();
	})
});