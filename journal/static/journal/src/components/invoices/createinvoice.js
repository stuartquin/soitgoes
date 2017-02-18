'use strict';
import React from 'react';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';


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
    const projects = this.props.projects.filter(p => !p.get('archived'));

    return (
      <div className='create-invoice'>

        <RaisedButton
          className='btn-success'
          label='Create New'
          labelPosition='before'
          onTouchTap={(evt) => {
            evt.preventDefault();
            this.setState({
              anchorEl: evt.currentTarget,
              open: true
            });
          }}
        />

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={() => this.handleClose()}
        >
          <Menu
            width='256px'
            className='invoice-projects'
            onChange={(evt, project) => {
              this.props.onCreateInvoice(project)
            }}>
          {projects.map((project) => {
            const label = (
              <div className='invoice-project-label'>
                <span>{project.get('name')}</span>
                <span>{project.get('uninvoiced_hours')} hrs</span>
              </div>
            );
            return (
              <MenuItem
                className='invoice-project'
                key={project.get('id')}
                value={project}
                primaryText={label}
              />
            );
          }).toArray()}
          </Menu>
        </Popover>
      </div>
    );
  }
}

export {CreateInvoice};
