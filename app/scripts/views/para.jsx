var React = require('react');
var Sentence = require('./sentence.jsx');

module.exports = React.createClass({

  render: function() {
    var elements = this.props.element.items;
    var renderItems = [];

    elements.forEach(function(item, index){
      renderItems.push(<Sentence element={item}
        onSelect={this.props.onSelect}
        selectedAddr={this.props.selectedAddr} />);
    }, this);

    return (
      <p>
        {renderItems}
      </p>
    );
  }

});
