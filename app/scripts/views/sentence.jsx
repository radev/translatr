var React = require('react');

var Sentence = React.createClass({

  render: function() {
    return (
      <div className="sentence">
        {this.props.data[1]}
      </div>
    );
  }

});

module.exports = Sentence;