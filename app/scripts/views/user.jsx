var React = require('react');
var color = require('../../lib/color');
module.exports = React.createClass({

  render: function() {
    var user = this.props.user;

    var style = {
      backgroundColor: user.color,
      color: color.getMatching(user.color)
    };

    return <li key={user.id} className="list-group-item" style={style}>{user.name}</li>;
  }

});
