'use strict';
import React from 'react';


const NewInvoiceProjectSelector = (props) => {
  return (
    <div className='new-invoice-project-selector'>

      <div className='close-action'>
        <h5>Select Project</h5>
        <a className='btn btn-default btn-xs'
          onClick={props.onCancel}>
          <i className='material-icons'>close</i>
          <div className='ripple-container'></div>
        </a>
      </div>

      <hr />

      <ul>
      {props.projects.map((project) => {
        return (
          <li key={project.get('id')}>
            <label>
              <input
                type='radio'
                checked={props.selected.get('id') === project.get('id')}
                onChange={() => props.onSelectProject(project)} />
              {project.get('name')}
            </label>
            <span>{ project.get('uninvoiced_hours') } hrs</span>
          </li>
        );
      })}
      </ul>

      <hr />

      <div className='vat-added'>
        <label>
           <input
             type='checkbox'
             checked={props.isVAT}
             onChange={() => props.onSetVAT()} />
          Add VAT
        </label>
      </div>

      <button key={1}
        className='btn btn-block btn-success btn-raised'
        onClick={() => props.onCreateInvoice(props.selected, props.isVAT)}>
        Create Invoice
      </button>

    </div>
  );
};

class CreateInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreating: false,
      isVAT: true,
      selectedProject: props.projects.first()
    };
  }

  newInvoice() {
    this.setState({
      isCreating: true
    });
  }

  selectProject(project) {
    this.setState({
      selectedProject: project
    });
  }

  setVAT(vat) {
    this.setState({
      isVAT: vat
    });
  }

  cancel() {
    this.setState({
      isCreating: false
    });
  }

  render() {
    let item;
    if (this.state.isCreating) {
      item = (
        <NewInvoiceProjectSelector
          projects={ this.props.projects }
          selected={ this.state.selectedProject }
          isVAT={ this.state.isVAT }
          onSelectProject={ (project) => this.selectProject(project) }
          onCreateInvoice={ this.props.onCreateInvoice }
          onSetVAT={(vat) => this.setVAT(vat)}
          onCancel={ () => this.cancel() }
        />
      );
    } else {
      item = (
        <button key={1}
          className='btn btn-block btn-success btn-raised'
          onClick={() => this.newInvoice()}>
          New Invoice
        </button>
      );
    }

    return (
      <div className='create-invoice panel panel-default'>
        <div className='panel-body'>
          {item}
        </div>
      </div>
    );
  }
}

export {CreateInvoice, NewInvoiceProjectSelector};
