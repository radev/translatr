'use strict';

var React = require('react');
var _ = require('underscore');
var Document = require('./document.jsx');
var EditForm = require('./edit-form.jsx');
var Roster = require('./roster.jsx');
var TranslationModel = require('../../models/translation');
var UserModel = require('../../models/user');
var pubnub = require('pubnub');
var randomColor = require('randomcolor');

module.exports = React.createClass({
  getInitialState: function() {
    var model = new TranslationModel({id: this.props.translationId});
    var user = new UserModel({
      id: this.props.userId,
      name: 'User' + _.random(1, 9999),
      color: randomColor({luminosity: 'dark'})
    });
    return {
      model: model,
      selectedAddr: null,
      user: user,
      users: [user]
    };
  },

  loadModelFromServer: function() {
    this.state.model.fetch();
  },

  componentDidMount: function() {
    var _this = this;
    this.state.model.on('sync', function() {
      if (!this.isMounted()) return;

      this.state.model.applyTranslations();
      this.setState({
        selectedAddr: [1,1,2]
      });
    }, this);


    this.loadModelFromServer();

    function getRoster() {
      pubnub.here_now({
        channel: _this.props.translationId,
        state: true,
        callback: function(response) {
          var users = _.compact(_.pluck(response.uuids, 'state')).map(function(state) {
             return new UserModel(state);
          });
          users = _.reject(users, function(user) {
            return user.id===_this.props.userId;
          });
          users.unshift(_this.state.user);
          _this.setState({users:users});
          console.log(response);
        }
      });
    }

    pubnub.subscribe({
      channel: this.props.translationId,
      message: function(m){
        /*
         {type: 'newRevision', addr: [1,1,1], revision: RevisionModel json}
         */
        console.log(m);
        _this.setState({});
      },
      presence: function(m) {
        getRoster();
        console.log(m);
      },
      connect: getRoster(),
      //uuid: this.props.userId,
      heartbeat: 15//, // Consider user left after 15 seconds
      //state: this.state.user.toJSON()
    });

    pubnub.state({
      channel: this.props.translationId,
      uuid: this.props.userId,
      state: this.state.user.toJSON(),
      callback: function(m) {
        console.log(m)
      },
      error: function(m) {
        console.log(m)
      }
    });
  },

  componentWillUnmount: function() {
    this.state.model.off();
    pubnub.unsubscribe({
      channel : this.props.translationId
    });
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
          <Roster users={this.state.users} />
        </div>
      </div>
    );
  }

});
