'use strict';
import React from 'react';

class ButtonMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreating: false
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
