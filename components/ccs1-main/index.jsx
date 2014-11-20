/** @jsx React.DOM */
//var bootstrap=Require("bootstrap");
var     Inputs=Require(    "inputs");
var   Colllist=Require(  "colllist");
var  Titlelist=Require( "titlelist");
var Authorlist=Require("authorlist");
var    dataset=Require(   "dataset");
var        api=Require(       "api");
var        lib=Require(       "lib");
var      Swipe=Require(     "swipe");
/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other");

var main = React.createClass({
  getInitialState: function() {
    return {
      colls  :[], coToFind:'', coToFindMax:50, collInfo:'',
      titles :[], tiToFind:'', tiToFindMax:50,
      authors:[], auToFind:'', auToFindMax:50};
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
  setColl:function(i){
    this.coIndex=i;
    this.setState({collInfo:dataset.collinfos[i]});
  },
  showCollInfo:function(){
    var c=this.state.collInfo, i, coIndex=this.coIndex;
    if(!c){
      if(this.state.colls.length)
        this.coIndex=i=this.state.colls[0];
      else if(this.state.titles.length)
        i=this.state.titles[0], this.coIndex=i=dataset.titlecoll[i][0];
      else return;
      coIndex=i, c=dataset.collinfos[i];
    }
    var fc=this.state.coToFind, ft=this.state.tiToFind, fa=this.state.auToFind;
    $('a.selected').removeClass('selected');
    var A=$('a'), x=lib.digit36(coIndex,3), i;
    for(i=0;i<A.length;i++)if(A[i].innerText===x)A[i].className='selected';
    c=c.replace(/(<coll.*?>)(.+?)(<\/coll>)/,function(m,m1,m2,m3){
      return ' <a class="selected">'+x+'</a> '+m1+m2.replace(fc,'<xc>'+fc+'</xc>')+m3;
    });
    c=c.replace(/(<ti.*?>)(.+?)(<\/ti>)/g,function(m,m1,m2,m3){
      return     m1+m2.replace(ft,'<xt>'+ft+'</xt>')+m3+' ';
    });
    c=c.replace(/(<pr.*?>)(.+?)(<\/pr>)/g,function(m,m1,m2,m3){
      return ' '+m1+m2.replace(fa,'<xa>'+fa+'</xa>')+m3+' ';
    });
    return c;
  },
  showTitles:function(){
    var tiToFind=this.state.tiToFind;
    return this.state.titles.map(function(t){
      var i=lib.digit36(t,4), n=dataset.titlenames[t];
      n=n.replace(tiToFind,'<xt>'+tiToFind+'</xt>')
      return i+' '+n
    }).join(',\n');
  },
  showAuthors:function(){
    var auToFind=this.state.auToFind;
    return this.state.authors.map(function(a){
      var i=lib.digit36(a,3), n=dataset.authors[a];
      n=n.replace(auToFind,'<xa>'+auToFind+'</xa>')
      return i+' '+n
    }).join(',\n');
  },
  onSwipeStart:function(target) {
    console.log(target.innerHTML);
  },
  onSwipeEnd:function(target) {

  },
  onTransitionEnd:function(index,slide,target) {
    console.log(index);
  },
  goSlide:function(e) {
     var n=parseInt(e.target.dataset.n);
     this.refs.Swipe.swipe.slide(n||0);
  },
  renderSlideButtons:function() {
    if (ksana.platform!="ios" && ksana.platform!="android") {
      return <div>
          <button data-n="0" onClick={this.goSlide}>0</button>
          <button data-n="1" onClick={this.goSlide}>1</button>
          <button data-n="2" onClick={this.goSlide}>2</button>
      </div>
    }
  },
  render: function() { 
    var coCount=this.state.colls  .length;
    var tiCount=this.state.titles .length;
    var auCount=this.state.authors.length;
    if(this.state.coToFindMax&&coCount===this.state.coToFindMax)
      coCount='<b>至少'+coCount+'</b>';
    var coFound='叢書名 含 <coll>'+this.state.coToFind+'</coll> '+coCount;
    if(this.state.tiToFindMax&&tiCount===this.state.tiToFindMax)
      tiCount='<b>至少'+tiCount+'</b>';
    var tiFound='書目名 含 <ti>  '+this.state.tiToFind+'</ti> '  +tiCount;
    if(this.state.auToFindMax&&auCount===this.state.auToFindMax)
      auCount='<b>至少'+auCount+'</b>';
    var auFound=  '人名 含 <pr>'  +this.state.auToFind+'</pr> '  +auCount;
    return (
      <div>
           {this.renderSlideButtons()}
         <Swipe ref="Swipe" continuous={true} 
               transitionEnd={this.onTransitionEnd} 
               swipeStart={this.onSwipeStart} swipeEnd={this.onSwipeEnd}>
          <div>
          <Inputs def="農桑" placeholder="書名" onChange={this.findCollsAndTitles}
            size="30"/>
          <span dangerouslySetInnerHTML={{__html: coFound}} />
          <pre>
            <Colllist
              colls ={this.state.colls} onCollChanged={this.setColl}
              tofind={this.state.coToFind} />
          </pre>
          <span dangerouslySetInnerHTML={{__html: tiFound}} />
          <pre>
            <Titlelist
              titles={this.state.titles} onCollChanged={this.setColl}
              tofind={this.state.tiToFind} />
          </pre>
        </div>
        <div>ccs1<br/>
          <h2>　中國古籍　叢書目錄　檢索　</h2>
          <pre  dangerouslySetInnerHTML={{__html: this.showCollInfo()}} />
        </div>

        <div>
          <Inputs def="禎" placeholder="人名" onChange={this.findAuthors}
            size="30"/>
          <span dangerouslySetInnerHTML={{__html: auFound}} />
          <pre>
            <Authorlist
              authors={this.state.authors} onCollChanged={this.setColl}
              tofind={this.state.auToFind} />
          </pre>
        </div>
      </Swipe>
      </div>
    );
  }
});
module.exports=main;