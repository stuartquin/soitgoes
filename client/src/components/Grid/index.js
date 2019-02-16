/* eslint-disable */
import React from 'react';
import styled, {css} from 'styled-components';

export const BREAKPOINTS = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 20px;

  max-width: 1200px;
  flex-grow: 1;
`;


export const Cell = styled.div`
  grid-column: span 12;

  ${props => Object.keys(BREAKPOINTS).map(k => props[k] ? css`
    @media(min-width: ${BREAKPOINTS[k]}) {
      grid-column: span ${props[k]};
    }
  `: '')}
`;

export const CellMd = styled(Cell)`
  @media(max-width: ${BREAKPOINTS.sm}) {
    display: none;
  }
`;
