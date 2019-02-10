import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'

const StyledLink = styled(Link)`
  margin-left: 4px;
  margin-right: 4px;
`;

const MenuItem = ({text, linkTo}) => (
  <StyledLink to={linkTo}>
    {text}
  </StyledLink>
);

export default MenuItem;
