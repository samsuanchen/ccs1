/** @jsx React.DOM */
var dataset=Require("dataset");
var lib=Require("lib");
var authorlist = React.createClass({
  renderColl :function(coIndex) {
    return <span>&nbsp;<a data-coIndex={coIndex}>{lib.digit36(coIndex,3)}</a></span>
  },
  renderAuthor:function(auIndex) {
    var authorname=dataset.authors[auIndex], tofind=this.props.tofind;
    authorname=authorname.replace(RegExp(tofind),function(m){
      return '<xa>'+m+'</xa>'
    });
    authorname='<pr>'+authorname+'</pr>';
    var colls=dataset.authorcoll[auIndex];
    if(typeof colls==='number') colls=[colls];
    return <div>
        <span dangerouslySetInnerHTML={{__html: authorname}} />
        {colls.map(this.renderColl)}
      </div>
  },
  setColl:function(e) {
    this.props.onCollChanged(parseInt(e.target.innerText,32));
  },
  render: function() {
    return (
      <div onClick={this.setColl}>
        {this.props.authors.map(this.renderAuthor)}
      </div>
    );
  }
});
module.exports=authorlist;