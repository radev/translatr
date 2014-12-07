var React = require('react');

var EditForm = React.createClass({

  getInitialState: function() {
    return {
      text: ''
    };
  },

  onTextChange: function(evt) {
    this.setState({
      text: evt.target.value
    })
  },

  handleSubmit: function() {
    this.props.onEdit(this.state.text);
  },

  handleCancel: function() {
    this.props.onCancel();
  },

  render: function() {
    var element = this.props.element;
    var trans =  element.getLatestTranslation();

    console.log('trans', trans);

    return (
      <form className="edit-form">
        Text to translate:
        <div className="translation-text">
          {element.originalText}
        </div>
        <textarea name="text" placeholder="Enter you translation here" onChange={this.onTextChange}></textarea>
        <div>
          Revisions: {element.revisions.length}
        </div>

        <div>
          <button type="button" className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
          <button type="button" className="btn btn-success" onClick={this.handleSubmit}>Accept</button>
        </div>
      </form>
    );
  }

});

module.exports = EditForm;
