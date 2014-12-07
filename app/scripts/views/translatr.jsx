'use strict';

var React = require('react');

var Document = require('./document.jsx');
var EditForm = require('./edit-form.jsx');
var TranslationModel = require('../../models/translation');
var pubnub = require('pubnub');

module.exports = React.createClass({
  getInitialState: function() {
    var model = new TranslationModel({id: this.props.translationId});

    return {
      model: model,
      selectedAddr: [1,2,2]
    };
  },

  loadModelFromServer: function() {
    this.state.model.fetch();
  },

  componentDidMount: function() {
    this.state.model.on('sync', function() {
      if (!this.isMounted()) return;

      this.state.model.applyTranslations();
      this.setState({});
    }, this);


    this.loadModelFromServer();

    var _this = this;
    pubnub.subscribe({
      channel: this.props.translationId,
      message: function(m){
        /*
         {type: 'newRevision', addr: [1,1,1], revision: RevisionModel json}
         */
        console.log(m);
        _this.setState({});
      }
    });

  },

  componentWillUnmount: function() {
    this.state.model.off();
  },

  handleSelect: function(addr) {
    pubnub.publish({
      channel: this.props.translationId,
      message: {
        type: 'select',
        userId: this.props.userId,
        addr: addr
      }
    });
    this.setState({ selectedAddr: addr });
  },

  render: function() {
    var form;
    var element = this.state.model.rootElement;

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
            <Document element={element}
              onSelect={this.handleSelect}
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
