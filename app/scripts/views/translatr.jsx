'use strict';

var React = require('react');

var Document = require('./document.jsx');
var EditForm = require('./edit-form.jsx');

module.exports = React.createClass({
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
            <Document data={this.props.data.tree} onSelect={this.handleSelect}  />
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
