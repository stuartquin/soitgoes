import React from 'react';
import styled from 'styled-components'

import {Grid, Cell} from 'components/Grid';
import MenuItem from 'components/MenuItem';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background: white;
  min-height: 56px;
  box-shadow: 0 2px 4px hsla(0,0%,40%,0.14)
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 1200px;
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
            text="Tracking"
            linkTo="/timeslips"
          />
          <MenuItem
            text="Logout"
            linkTo="/"
          />
        </Menu>
        {children}
      </Container>
    </Wrapper>
  );
};

export default NavMenu;
