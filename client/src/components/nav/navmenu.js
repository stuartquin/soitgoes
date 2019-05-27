import React from 'react';
import styled from 'styled-components'

import {Container, Grid, Cell} from 'components/Grid';
import MenuItem from 'components/MenuItem';
import {logout} from 'services/api';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background: white;
  padding-top: 12px;
  padding-bottom: 12px;
  box-shadow: 0 2px 4px hsla(0,0%,40%,0.14)
`;

const Menu = styled.div`
`;

const NavMenu = ({children}) => {
  return (
    <Wrapper>
      <Container>
        <Menu>
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
          <MenuItem
            text="Logout"
            linkTo="/"
            onClick={() => logout()}
          />
        </Menu>
        {children}
      </Container>
    </Wrapper>
  );
};

export default NavMenu;
