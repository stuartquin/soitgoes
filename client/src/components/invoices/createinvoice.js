'use strict';
import React from 'react';

import Button from 'components/Button';

class CreateInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false
    };
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  render() {
    const projects = Object.values(this.props.projects).filter(p => !p.archived);

    return (
      <div className="create-invoice">
        <h3>New</h3>

        <div>
          {projects.map((project) => {
            const label = (
              <div className='invoice-project-label'>
                <span>{project.name} </span>
                <span>{project.uninvoiced_hours} hrs</span>
              </div>
            );
            return (
              <a
                onClick={() => this.props.onCreateInvoice(project.id)}
                className='invoice-project'
                key={project.id}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CreateInvoice;
