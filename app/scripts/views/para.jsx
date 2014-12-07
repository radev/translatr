var React = require('react');
var Sentence = require('./sentence.jsx');

module.exports = React.createClass({

  render: function() {
    var props = this.props.data;
    var renderItems = [];

    props.forEach(function(item, index){
      if (index > 0) {
        renderItems.push(<Sentence data={item} onSelect={this.props.onSelect} />);
      }
    }, this);

    return (
      <p>
        {renderItems}
      </p>
    );
  }

});
