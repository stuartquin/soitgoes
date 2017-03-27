'use strict';
import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


const NavMenu = (props) => {
  const linkTo = (route) => () => {
    props.onNavigate(route);
    props.onSetOpen(false);
  }

  return (
    <Drawer
      containerClassName='nav-container'
      docked={false}
      open={props.open}
      onRequestChange={(open) => props.onSetOpen(open)}>

      <AppBar
        title='InvoiceTime'
        className='nav-app-bar'
        onTitleTouchTap={() => props.onSetOpen(!props.open)}
      />
      <div className='app-menu'>
        <MenuItem
          className='nav-item'
          primaryText='Dash'
          onTouchTap={linkTo('/')}
        />
        <MenuItem
          className='nav-item'
          primaryText='Contacts'
          onTouchTap={linkTo('/contacts')}
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
      </div>
      <div className='user-menu'>
        <MenuItem
          className='nav-item'
          primaryText='Logout'
          onTouchTap={props.onLogout}
        />
      </div>
    </Drawer>
  );
};

export default NavMenu;
