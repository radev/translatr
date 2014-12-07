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
      selectedAddr: null
    };
  },

  loadModelFromServer: function() {
    this.state.model.fetch();
  },

  componentDidMount: function() {
    this.state.model.on('sync', function() {
      if (!this.isMounted()) return;

      this.state.model.applyTranslations();
      this.setState({
        selectedAddr: [1,1,2]
      });
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

  handleEdit: function(text) {
    var newTrans = [
      this.state.selectedAddr,
      [{text: text, userId: 'current user'}]
    ];
    var element = this.state.model.getByAddress(this.state.selectedAddr);

    if (element) {
      this.state.model.applyTranslation(element, newTrans)
    }
    this.forceUpdate();
  },

  handleEditCancel: function() {
    this.setState({ selectedAddr: null });
  },

  render: function() {
    var form;
    var element = this.state.model.rootElement;

    if (this.state.selectedAddr) {
      var selectedElement = this.state.model.getByAddress(this.state.selectedAddr)
      form =
      <div className="translatr__form">
        <EditForm element={selectedElement} onCancel={this.handleEditCancel} onEdit={this.handleEdit} />
      </div>;
    }


    return (
      <div className="translatr">
        <div className="translatr__content">
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
