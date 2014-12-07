'use strict';

var React = require('react');

var Document = require('./document.jsx');
var EditForm = require('./edit-form.jsx');
var TranslationModel = require('../../models/translation');

module.exports = React.createClass({
  getInitialState: function() {
    var model = new TranslationModel({id: this.props.translationId});

    return {
      model: model,
      selectedAddr: '1-2-2'
    };
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

  handleSelect: function(addr) {
    this.setState({ selectedAddr: addr });
  },

  render: function() {
    var form;

    var tree = this.state.model.tree || [];

    if (this.state.selectedAddr) {
      form =
      <div className="translatr__form">
        <EditForm selectedAddr={this.state.selectedAddr} />
      </div>;
    }


    return (
      <div className="translatr">
        <div className="translatr__content">
          <div>
            selectedAddr={this.state.selectedAddr}
          </div>

          <div className="translatr__sentences">
            <Document data={tree}
              onSelect={this.handleSelect}
              addr='1'
              selectedAddr={this.state.selectedAddr}
               />
          </div>

          {form}

        </div>
        <div className="translatr__bar">
          lorem
        </div>
      </div>
    );
  }

});
