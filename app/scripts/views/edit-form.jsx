var React = require('react');

var EditForm = React.createClass({

  render: function() {
    return (
      <form>
        <p>
          <textarea name="text" className="translation-text"></textarea>
        </p>

        <div>
          <button type="button" className="btn btn-default">Cancel</button>
          <button type="button" className="btn btn-success">Accept</button>
        </div>
      </form>
    );
  }

});

module.exports = EditForm;