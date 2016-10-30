import React from 'react';

class InvoiceAdvanced extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dueDate: props.invoice.get('due_date')
    };
  }

  handleDueDateChange(event) {
    this.setState({
      dueDate: event.target.value
    });
  }

  render() {
    return (
      <div className='invoice-advanced panel panel-default'>
        <div className='invoice-due-date panel-body'>
          <label>
            <span>Due Date:</span>
            <input
              type='date'
              value={this.state.dueDate}
              onChange={(e) => this.handleDueDateChange(e)}
            />
          </label>
          <button className='btn btn-success btn-raised'
            onClick={() => this.props.onUpdate({
              due_date: this.state.dueDate
            })}>
            Update
          </button>
        </div>
      </div>
    );
  }
}

export {InvoiceAdvanced};
