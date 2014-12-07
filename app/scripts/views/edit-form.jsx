var React = require('react');

var EditForm = React.createClass({

  render: function() {
    return (
      <form className="edit-form">
        <div className="translation-text">
        translation-text here
        </div>
        <textarea name="text" placeholder="Enter you translation here"></textarea>

        <div>
          <button type="button" className="btn btn-default">Cancel</button>
          <button type="button" className="btn btn-success">Accept</button>
        </div>
      </form>
    );
  }

});

module.exports = EditForm;