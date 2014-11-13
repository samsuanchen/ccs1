/** @jsx React.DOM */
var dataset=Require("dataset");
var lib=Require("lib");
var  colllist = React.createClass({
  renderItem:function(coIndex) {
    var  collname=dataset. collnames[coIndex], tofind=this.props.tofind;
     collname= collname.replace(RegExp(tofind),function(m){
      return '<xc>'+m+'</xc>'
    });
    return <div>
        <a data-coIndex={coIndex}>{lib.digits(coIndex,3,32)}</a>&nbsp;
        <span dangerouslySetInnerHTML={{__html:  collname}} />
      </div>
  },
  setColl :function(e) {
    this.props. onCollChanged(parseInt(e.target.innerText,32));
  },
  render:function() {
    return <div onClick={this.setColl }>{this.props. colls.map(this.renderItem)}</div>
  }
});
module.exports=colllist;