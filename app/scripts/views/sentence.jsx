var React = require('react');
var _ = require('underscore');
var color = require('../../lib/color');

var Sentence = React.createClass({
  handleClick: function(evt) {
    this.props.onSelect(this.props.element.addr);
  },

  render: function() {
    var element = this.props.element;
    var originalText = element.originalText;
    var text = element.getTranslatedText();
    var editingUser = _.find(this.props.users, function(user) {
      return _.isEqual(element.addr, user.selectedAddr);
    });
    var className = 'sentence';
    var style={};
    if (editingUser) {
      style = {
        backgroundColor: editingUser.color,
        color: color.getMatching(editingUser.color)
      };
    }


    return (
      <span className={className} style={style} onClick={this.handleClick} title={originalText}>
        {text}
      </span>
    );
  }

});

module.exports = Sentence;
