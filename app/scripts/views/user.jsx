var React = require('react');
var colorString = require("color-string");
var convert = require("color-convert");

module.exports = React.createClass({

  render: function() {
    var user = this.props.user;
    var luma = convert().rgb(colorString.getRgb(user.color)).hsl()[2];
    var color;
    if (luma<50) {
        color = '#ffffff';
    } else {
        color = '#404040';
    }
    var style = {
      backgroundColor: user.color,
      color: color
    };

    return <li key={user.id} className="list-group-item" style={style}>{user.name}</li>;
  }

});
