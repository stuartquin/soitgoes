'use strict';
import React from 'react';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';


const NewInvoiceProjectSelector = (props) => {
  return (
    <Dialog
      title='Create Invoice'
      modal={true}
      open={true}
      autoScrollBodyContent={true}
      onRequestClose={props.onCancel}
    >
      <RadioButtonGroup
        name='invoiceProject'
        onChange={(evt, project) => {
          props.onCreateInvoice(project)
        }}
        className='invoice-projects'
      >
      {props.projects.map((project) => {
        const label = (
          <div className='invoice-project-label'>
            <span>{project.get('name')}</span>
            <span>{project.get('uninvoiced_hours')} hrs</span>
          </div>
        );
        return (
          <RadioButton
            className='invoice-project'
            key={project.get('id')}
            value={project}
            label={label}
          />
        );
      })}
      </RadioButtonGroup>
    </Dialog>
  );
  //   <div className='new-invoice-project-selector'>

  //     <div className='close-action'>
  //       <h5>Select Project</h5>
  //       <a className='btn btn-default btn-xs'
  //         onClick={props.onCancel}>
  //         <i className='material-icons'>close</i>
  //         <div className='ripple-container'></div>
  //       </a>
  //     </div>

  //     <hr />

  //     <ul>
  //     {props.projects.map((project) => {
  //       return (
  //         <li key={project.get('id')}>
  //           <label>
  //             <input
  //               type='radio'
  //               checked={props.selected.get('id') === project.get('id')}
  //               onChange={() => props.onSelectProject(project)} />
  //             {project.get('name')}
  //           </label>
  //           <span>{ project.get('uninvoiced_hours') } hrs</span>
  //         </li>
  //       );
  //     })}
  //     </ul>

  //     <hr />

  //     <div className='vat-added'>
  //       <label>
  //          <input
  //            type='checkbox'
  //            checked={props.isVAT}
  //            onChange={() => props.onSetVAT()} />
  //         Add VAT
  //       </label>
  //     </div>

  //     <RaisedButton
  //       className='btn-success'
  //       label='Create Invoice'
  //       onTouchTap={() => props.onCreateInvoice(props.selected, props.isVAT)}
  //     />

  //   </div>
  // );
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
    const projects = this.props.projects.filter(
      project => !project.get('archived')
    );
    if (this.state.isCreating) {
      item = (
        <NewInvoiceProjectSelector
          projects={ projects }
          selected={ this.state.selectedProject }
          isVAT={ this.state.isVAT }
          onSelectProject={ (project) => {
            this.selectProject(project)
          }}
          onCreateInvoice={ this.props.onCreateInvoice }
          onSetVAT={(vat) => this.setVAT(vat)}
          onCancel={ () => this.cancel() }
        />
      );
    } else {
      item = (
        <RaisedButton
          className='btn-success'
          label='Create New'
          onTouchTap={() => this.newInvoice()}
        />
      );
    }

    return (
      <div className='create-invoice'>
        {item}
      </div>
    );
  }
}

export {CreateInvoice, NewInvoiceProjectSelector};
