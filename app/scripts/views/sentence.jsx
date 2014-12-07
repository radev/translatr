var React = require('react');

var Sentence = React.createClass({
  getInitialState: function() {
    return {
      isEdit: false
    };
  },

  handleClick: function(evt) {
    this.setState({ isEdit: !this.state.isEdit })
    this.props.onSelect('sss');
  },

  render: function() {
    var className = 'sentence' + (this.state.isEdit ? ' sentence--edit' : '');

    return (
      <span className={className} onClick={this.handleClick}>
        {this.props.data[1]}
      </span>
    );
  }

});

module.exports = Sentence;