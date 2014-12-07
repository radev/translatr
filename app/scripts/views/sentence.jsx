var React = require('react');
var _ = require('underscore');

var Sentence = React.createClass({
  handleClick: function(evt) {
    this.props.onSelect(this.props.element.addr);
  },

  render: function() {
    var element = this.props.element;
    var originalText = element.originalText;
    var text = element.getTranslatedText();
    var isEdit = _.isEqual(element.addr, this.props.selectedAddr);
    var className = 'sentence' + (isEdit ? ' sentence--edit' : '');

    return (
      <span className={className} onClick={this.handleClick} title={originalText}>
        {text}
      </span>
    );
  }

});

module.exports = Sentence;