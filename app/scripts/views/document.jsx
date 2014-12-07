var React = require('react');
var Para = require('./para.jsx');

module.exports = React.createClass({

  render: function() {
    var elements = this.props.element.items;
    var renderItems = [];

    elements.forEach(function(item, index){
      renderItems.push(<Para element={item}
        onSelect={this.props.onSelect}
        selectedAddr={this.props.selectedAddr} />);
    }, this);

    return (
      <div className="sentence-list">
        {renderItems}
      </div>
    );
  }

});
