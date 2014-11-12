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
var api=Require("api");
/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var main = React.createClass({
  getInitialState: function() {
    return {titles:[], colls:[], authors:[]};
  },
  findCollsAndTitles:function(tofind) {
    var colls=api.search.findCollection(tofind);
    var titles=api.search.findTitle(tofind);
    this.setState({titles:titles,colls:colls});
  },
  findAuthors:function(tofind) {
    var authors=api.search.findAuthor(tofind);
    this.setState({authors:authors});
  },
  render: function() {
    return (
      <div>
        <div className="col-md-4">
          <inputs def="農" placeholder="書名" onChange={this.findCollsAndTitles}
            size="30"/>
          <span>叢書: {this.state.colls}</span><br/>
          <span>書目: {this.state.titles}</span>
        </div>
        <div className="col-md-4">
          <h2>　中國古籍　叢書目錄　檢索系統　ccs1　</h2>
        </div>
        <div className="col-md-4">
          <inputs def="貫" placeholder="人名" onChange={this.findAuthors}
            size="30"/>
          <span>人名: {this.state.authors}</span>
        </div>
      </div>
    );
  }
});
module.exports=main;