var React = require('react');
var Sentence = require('./sentence.jsx');

var SentenceList = React.createClass({

  render: function() {
    var sentences = this.props.data;
    var sentRender = [];

    sentences.forEach(function(sent, index){
      if (index !== 0) {
        sentRender.push(<Sentence text={sent[1]} />);
      }
    });

    return (
      <div className="sentence-list">
        {sentRender}
      </div>
    );
  }

});

module.exports = SentenceList;