var React = require('react');
var Para = require('./para.jsx');

module.exports = React.createClass({

  render: function() {
    var props = this.props.data;
    var renderItems = [];

    props.forEach(function(item, index){
      var addr = this.props.addr + '-' + index;

      if (index > 0) {
        renderItems.push(<Para data={item}
          onSelect={this.props.onSelect}
          addr={addr}
          selectedAddr={this.props.selectedAddr} />);
      }
    }, this);

    return (
      <div className="sentence-list">
        {renderItems}
      </div>
    );
  }

});
