var React = require('react');
var Sentence = require('./sentence.jsx');

module.exports = React.createClass({

  render: function() {
    var props = this.props.data;
    var renderItems = [];

    props.forEach(function(item, index){
      var addr = this.props.addr + '-' + index;

      if (index > 0) {
        renderItems.push(<Sentence data={item}
          addr={addr}
          onSelect={this.props.onSelect}
          selectedAddr={this.props.selectedAddr} />);
      }
    }, this);

    return (
      <p>
        {renderItems}
      </p>
    );
  }

});
