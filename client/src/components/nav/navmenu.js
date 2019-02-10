'use strict';
import React from 'react';

import MenuItem from 'components/MenuItem';


const NavMenu = () => {
  return (
    <div className="navMenu">
      <div className="app-menu">
        <MenuItem
          text="Dash"
          linkTo="/"
        />
        <MenuItem
          text="Contacts"
          linkTo="/contacts"
        />
        <MenuItem
          text="Projects"
          linkTo="/projects"
        />
        <MenuItem
          text="Invoices"
          linkTo="/invoices"
        />
        <MenuItem
          text="Time"
          linkTo="/timeslips"
        />
        <MenuItem
          text="Tasks"
          linkTo="/tasks"
        />
      </div>
      <div className="user-menu">
        <MenuItem
          text="Logout"
          linkTo="/"
        />
      </div>
    </div>
  );
};

export default NavMenu;
