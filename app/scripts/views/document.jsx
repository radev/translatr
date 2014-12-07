var React = require('react');
var Para = require('./para.jsx');

module.exports = React.createClass({

  render: function() {
    var props = this.props.data;
    var renderItems = [];

    props.forEach(function(item, index){
      if (index > 0) {
        renderItems.push(<Para data={item} onSelect={this.props.onSelect} />);
      }
    }, this);

    return (
      <div className="sentence-list">
        {renderItems}
      </div>
    );
  }

});
