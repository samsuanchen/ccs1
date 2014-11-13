/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var inputs = React.createClass({
  getInitialState: function() {
    return {deftofind:this.props.def};
  },
  oninput:function() {
    var tofind=this.refs.tofind.getDOMNode().value;
    this.setState({deftofind:tofind});
    clearTimeout(this.timer);
    //bind context must be null to get rid of warning message
    this.timer=setTimeout( this.props.onChange.bind(null,tofind),300);
  },
  onkeydown:function(e) {
    var tofind=this.refs.tofind.getDOMNode().value;
    if (e&&e.key=="Enter")
      this.props.onChange(tofind);
  },
  componentDidMount:function() {
    this.oninput();
  },
  render: function() {
    return (
      <div>
        <span>{this.props.placeholder}檢索 (搜尋 /{this.state.deftofind}/)</span>
        <input 
          defaultValue={this.state.deftofind}
          placeholder={this.props.placeholder} ref="tofind"
          onInput={this.oninput}
          size={this.props.size}/>
      </div>
    );
  }
});
module.exports=inputs;