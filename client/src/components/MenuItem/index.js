import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const StyledLink = styled(NavLink)`
  margin-right: 12px;
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => props.theme.colors.brand_dark};
  padding-bottom: 12px;

  font-size: 12px;
  text-transform: uppercase;

  &:visited {
    color: ${(props) => props.theme.colors.brand_dark};
  }

  &:hover {
    color: ${(props) => props.theme.colors.brand_main};
  }
`;

const ACTIVE_STYLE = {
  borderBottom: 'solid 2px',
};

const MenuItem = ({ text, linkTo }) => (
  <StyledLink to={linkTo} activeStyle={ACTIVE_STYLE}>
    {text}
  </StyledLink>
);

export default MenuItem;
