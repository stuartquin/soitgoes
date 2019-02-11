import React from 'react';
import styled from 'styled-components'

import MenuItem from 'components/MenuItem';


const AppMenu = styled.div`
  display: flex;
  align-items: center;
`;


const NavMenu = () => {
  return (
    <div>
      <AppMenu>
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
      </AppMenu>
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
