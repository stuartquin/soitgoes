import React from 'react';
import styled from 'styled-components';
import {BREAKPOINTS, Grid} from 'components/Grid';

export const Row = styled(Grid)`
  color: #4e5767;
  padding: 12px 16px;
  cursor: pointer;
  background: white;
  align-items: center;
  box-sizing: border-box;

  &:nth-child(odd) {
    background: #f4f6fa;
  }

  &:hover {
    background: #f5fcff;
  }
`;

export const Header = styled(Grid)`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: #f5f3f5;
  color: #4e5767;
  text-transform: uppercase;
  padding: 12px 16px;
  font-weight: bold;
  box-sizing: border-box;

  @media(max-width: ${BREAKPOINTS.sm}) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;
