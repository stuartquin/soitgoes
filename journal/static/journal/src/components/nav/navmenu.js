'use strict';
import React from 'react';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


const NavMenu = (props) => {
  const linkTo = (route) => () => {
    browserHistory.push(route);
    props.onClose();
  }

  return (
    <Drawer containerClassName='nav-container' open={props.open}>
      <AppBar
        title='InvoiceTime'
        className='nav-app-bar'
        onTitleTouchTap={props.onToggle}
      />
      <MenuItem
        className='nav-item'
        primaryText='Dash'
        onTouchTap={linkTo('/dash')}
      />
      <MenuItem
        className='nav-item'
        primaryText='Projects'
        onTouchTap={linkTo('/projects')}
      />
      <MenuItem
        className='nav-item'
        primaryText='Invoices'
        onTouchTap={linkTo('/invoices')}
      />
      <MenuItem
        className='nav-item'
        primaryText='Time'
        onTouchTap={linkTo('/timeslips')}
      />
      <MenuItem
        className='nav-item'
        primaryText='Tasks'
        onTouchTap={linkTo('/tasks')}
      />
    </Drawer>
  );
};

export {NavMenu};
