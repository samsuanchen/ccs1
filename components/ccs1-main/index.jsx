/** @jsx React.DOM */
/*
var bootstrap=Require("bootstrap");
var titles=Require("titles");
var authors=Require("authors");
var collections=Require("collections");
var titleList=Require("titlelist");
var collectionlist=Require("collectionlist");
*/
var inputs=Require("inputs");
var  colllist=Require( "colllist");
var titlelist=Require("titlelist");
var dataset=Require("dataset");
var api=Require("api");
var lib=Require("lib");
/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other");

var main = React.createClass({
  getInitialState: function() {
    return {
      colls  :[], coToFind:'', coToFindMax: 50, collInfo:'',
      titles :[], tiToFind:'', tiToFindMax:100,
      authors:[], auToFind:'', auToFindMax:  0};
  },
  findCollsAndTitles:function(tofind) {
    this.findColls (tofind);
    this.findTitles(tofind);
  },
  findColls:function(tofind) {
    var colls =api.search.findCollection(tofind,this.state.coToFindMax);
    this.setState({colls  :colls  ,coToFind:tofind});
  }, 
  findTitles:function(tofind) {
    var titles=api.search.findTitle     (tofind,this.state.tiToFindMax);
    this.setState({titles :titles ,tiToFind:tofind});
  }, 
  findAuthors:function(tofind) {
    var authors=api.search.findAuthor   (tofind,this.state.auToFindMax);
    this.setState({authors:authors,auToFind:tofind});
  },
  setColl:function(coIndex){
    this.setState({collInfo:dataset.collinfos[coIndex]});
  },
  showCollInfo:function(){
    var c=this.state.collInfo;
    if(!c){
      if(this.state.colls.length)
        c=dataset.collinfos[this.state.colls[0]];
      else if(this.state.titles.length) {
        var t=this.state.titles[0];
        c=dataset.titlecoll[t];
        if(typeof c!=='number') c=c[0];
        c=dataset.collinfos[c];
      } else return;
    }
    var fc=this.state.coToFind,ft=this.state.tiToFind,fa=this.state.auToFind;
    c=c.replace(/(<coll.*?>)(.+?)(<\/coll>)/,function(m,m1,m2,m3){
      return ' '+m1+m2.replace(fc,'<xc>'+fc+'</xc>')+m3;
    });
    c=c.replace(/(<ti.*?>)(.+?)(<\/ti>)/g,function(m,m1,m2,m3){
      return     m1+m2.replace(ft,'<xt>'+ft+'</xt>')+m3+' ';
    });
    c=c.replace(/(<pr.*?>)(.+?)(<\/pr>)/g,function(m,m1,m2,m3){
      return     m1+m2.replace(fa,'<xa>'+fa+'</xa>')+m3+' ';
    });
    return c;
  },
  showTitles:function(){
    var tiToFind=this.state.tiToFind;
    return this.state.titles.map(function(t){
      var i=lib.digits(t,4,32), n=dataset.titlenames[t];
      n=n.replace(tiToFind,'<xt>'+tiToFind+'</xt>')
      return i+' '+n
    }).join(',\n');
  },
  showAuthors:function(){
    var auToFind=this.state.auToFind;
    return this.state.authors.map(function(a){
      var i=lib.digits(a,3,32), n=dataset.authors[a];
      n=n.replace(auToFind,'<xa>'+auToFind+'</xa>')
      return i+' '+n
    }).join(',\n');
  },
  render: function() { 
    var coCount=this.state.colls  .length;
    var tiCount=this.state.titles .length;
    var auCount=this.state.authors.length;
    if(this.state.coToFindMax&&coCount===this.state.coToFindMax)coCount='<b>至少'+coCount+'</b>';
    if(this.state.tiToFindMax&&tiCount===this.state.tiToFindMax)tiCount='<b>至少'+tiCount+'</b>';
    if(this.state.auToFindMax&&auCount===this.state.auToFindMax)auCount='<b>至少'+auCount+'</b>';
    return (
      <div>
        <div className="col-md-4">
          <inputs def="農桑" placeholder="書名" onChange={this.findCollsAndTitles}
            size="30"/>
          叢書:&nbsp;
          <span dangerouslySetInnerHTML={{__html: coCount}} />
          <pre>
            <colllist
              colls ={this.state.colls} onCollChanged={this.setColl}
              tofind={this.state.coToFind} />
          </pre>
          書目:&nbsp;
          <span dangerouslySetInnerHTML={{__html: tiCount}} />
          <pre>
            <titlelist
              titles={this.state.titles} onCollChanged={this.setColl}
              tofind={this.state.tiToFind} />
          </pre>
        </div>
        <div className="col-md-4">ccs1<br/>
          <h2>　中國古籍　叢書目錄　檢索　</h2>
          <pre  dangerouslySetInnerHTML={{__html: this.showCollInfo()}} />
        </div>
        <div className="col-md-4">
          <inputs def="禎" placeholder="人名" onChange={this.findAuthors}
            size="30"/>
          人名:&nbsp;
          <span dangerouslySetInnerHTML={{__html: auCount}} />
          <pre  dangerouslySetInnerHTML={{__html: this.showAuthors()}} />
        </div>
      </div>
    );
  }
});
module.exports=main;