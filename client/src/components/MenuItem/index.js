import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'

const StyledLink = styled(Link)`
  margin-right: 12px;
  font-weight: bold;
  text-decoration: none;
  color: #38547d;

  &:hover {
    text-decoration: underline;
  }
`;

const MenuItem = ({text, linkTo, onClick}) => (
  <StyledLink to={linkTo} onClick={onClick}>
    {text}
  </StyledLink>
);

export default MenuItem;
