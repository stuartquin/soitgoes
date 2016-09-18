'use strict';
import React from 'react';

class CreateInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: this.props.projectSummary.get(0)
    };
  }

  handleChange(value) {
    this.setState({
      project: this.props.projectSummary.get(value)
    });
  }

  render() {
    return (
      <div>
        <div className='form-group'>
          <label className='control-label'>Project: </label>
          <select className='form-control'
            onChange={(e) => this.handleChange(e.target.value)}>
          {this.props.projectSummary.valueSeq().map((project, idx) => (
            <option value={idx}>{project.get('name')}</option>
          ))}
          </select>
        </div>

        <button className='btn btn-block btn-success btn-raised'
          onClick={() => this.props.onCreateInvoice(this.state.project)}>
          Create Invoice
        </button>
      </div>
    );
  }
}

export {CreateInvoice};
