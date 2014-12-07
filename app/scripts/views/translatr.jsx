'use strict';

var React = require('react');

var Document = require('./document.jsx');
var EditForm = require('./edit-form.jsx');
var TranslationModel = require('../../models/translation');

module.exports = React.createClass({
  getInitialState: function() {
    var model = new TranslationModel({id: this.props.translationId});
    return {model: model};
  },

  loadModelFromServer: function() {
    this.state.model.fetch();
  },

  componentDidMount: function() {
    this.state.model.on('sync', function() {
      if (!this.isMounted()) {
        return;
      }
      this.setState({});
    }, this);
    this.loadModelFromServer();
  },

  componentWillUnmount: function() {
    this.state.model.off();
  },

  handleSelect: function(a) {
    alert(a);
  },

  render: function() {
    return (
      <div className="translatr">
        <div className="translatr__content">

          {this.props.data.text}
          <br />

          <div className="translatr__sentences">
            <Document data={this.props.data.tree} onSelect={this.handleSelect} />
          </div>
          <div className="translatr__form">
            <EditForm />
          </div>
        </div>
        <div className="translatr__bar">
          lorem
        </div>
      </div>
    );
  }

});
