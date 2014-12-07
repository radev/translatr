var React = require('react');
var User = require('./user.jsx');

module.exports = React.createClass({

  render: function() {
    var users = this.props.users.map(function (user) {
      return (
        <User user={user} />
      );
    });
    return (
      <div className="list-group">
        {users}
      </div>
    );
  }

});
