/** @jsx React.DOM */
var dataset=Require("dataset");
var lib=Require("lib");
var titlelist = React.createClass({
  renderColl :function(coIndex) {
    return <span>&nbsp;<a data-coIndex={coIndex}>{lib.digits(coIndex,3,32)}</a></span>
  },
  renderTitle:function(tiIndex) {
    var titlename=dataset.titlenames[tiIndex], tofind=this.props.tofind;
    titlename=titlename.replace(RegExp(tofind),function(m){
      return '<xt>'+m+'</xt>'
    });
    var colls=dataset.titlecoll[tiIndex];
    if(typeof colls==='number') colls=[colls];
    return <div>
        <span dangerouslySetInnerHTML={{__html: titlename}} />
        {colls.map(this.renderColl)}
      </div>
  },
  setColl:function(e) {
    this.props.onCollChanged(parseInt(e.target.innerText,32));
  },
  render: function() {
    return (
      <div onClick={this.setColl}>
        {this.props.titles.map(this.renderTitle)}
      </div>
    );
  }
});
module.exports=titlelist;