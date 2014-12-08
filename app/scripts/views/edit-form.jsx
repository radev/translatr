var React = require('react');

var EditForm = React.createClass({

  getInitialState: function() {
    return {
      text: '',
      selectedElement: null
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
    // if (this.state.selectedElement) {
    //   var trans =  element.getLatestTranslation();
    // }
    var element = this.props.element;

    return (
      <form className="edit-form">
        Text to translate:
        <div className="translation-text">
          {element.originalText}
        </div>
        <textarea ref="text" placeholder="Enter you translation here" value={this.state.text} onChange={this.onTextChange}></textarea>
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
