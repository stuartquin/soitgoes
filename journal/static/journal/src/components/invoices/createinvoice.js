'use strict';
import React from 'react';

import styles from './styles.css';

const NewInvoiceProjectSelector = (props) => {
  return (
    <div className={ styles.newInvoiceProjectSelector }>
      <h5>Select Project</h5>
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
          </li>
        );
      })}
      </ul>
      <button key={1}
        className='btn btn-block btn-success btn-raised'
        onClick={() => props.onCreateInvoice(props.selected)}>
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

  render() {
    let item;
    if (this.state.isCreating) {
      item = (
        <NewInvoiceProjectSelector
          projects={ this.props.projects }
          selected={ this.state.selectedProject }
          onSelectProject={ (project) => this.selectProject(project) }
          onCreateInvoice={ this.props.onCreateInvoice }
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
      <div className='panel panel-default'>
        <div className='panel-body'>
          {item}
        </div>
      </div>
    );
  }
}

export {CreateInvoice};
