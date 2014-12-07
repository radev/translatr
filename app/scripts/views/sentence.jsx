var React = require('react');

var Sentence = React.createClass({
  handleClick: function(evt) {
    // this.setState({ isEdit: !this.state.isEdit })
    this.props.onSelect(this.props.addr);
  },

  render: function() {
    var isEdit = this.props.addr == this.props.selectedAddr;
    var className = 'sentence' + (isEdit ? ' sentence--edit' : '');

    return (
      <span className={className} onClick={this.handleClick}>
        {this.props.data[1]}
      </span>
    );
  }

});

module.exports = Sentence;