/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var main = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div>
        Rendering main
      </div>
    );
  }
});
module.exports=main;