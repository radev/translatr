'use strict';

var React = require('react');

var ParaList = require('./para-list.jsx');
var EditForm = require('./edit-form.jsx');

module.exports = React.createClass({
  render: function() {
    var paras = this.props.data.tree;
    paras.splice(0, 1);

    console.log(paras);

    return (
      <div className="translatr">
        <div className="translatr__content">

          {this.props.data.text}
          <br />

          <div className="translatr__sentences">
            <ParaList data={paras}  />
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
