/** @jsx React.DOM */
var numberBase=36;
var dataset=Require("dataset");
var lib=Require("lib");
var  colllist = React.createClass({
  renderItem:function(coIndex) {
    var  collname=dataset. collnames[coIndex], tofind=this.props.tofind;
      collname= collname.replace(RegExp(tofind),function(m){
      return '<xc>'+m+'</xc>'
    });
      collname='<coll>'+collname+'</coll>';
    return <div>
        <a data-coIndex={coIndex}>{lib.digit36(coIndex,3)}</a>&nbsp;
        <span dangerouslySetInnerHTML={{__html:  collname}} />
      </div>
  },
  setColl:function(e) {
    this.props. onCollChanged(parseInt(e.target.innerText,numberBase));
  },
  render:function() {
    return <div onClick={this.setColl }>{this.props. colls.map(this.renderItem)}</div>
  }
});
module.exports=colllist;