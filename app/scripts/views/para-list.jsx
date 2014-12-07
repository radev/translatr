var React = require('react');
var Sentence = require('./sentence.jsx');

var SentenceList = React.createClass({

  render: function() {
    var sents = this.props.data;
    var pRender = [];

    sents.splice(0, 1);
    console.log('sents=', sents);

    sents.forEach(function(sent, index){

      if (index !== 0) {
        pRender.push(<Sentence data={sent} />);
      }
    });

    return (
      <p className="sentence-list">
        {pRender}
      </p>
    );
  }

});

module.exports = SentenceList;