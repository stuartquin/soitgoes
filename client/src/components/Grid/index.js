/* eslint-disable */
import React from 'react';
import styled, {css} from 'styled-components';

const BREAKPOINTS = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 20px;

  max-width: 1200px;
  flex-grow: 1;
`;

const media = '@media';

const Cell = styled.div`
  grid-column: span 12;

  ${props => Object.keys(BREAKPOINTS).map(k => props[k] ? css`
    @media(min-width: ${BREAKPOINTS[k]}) {
      grid-column: span ${props[k]};
    }
  `: '')}
`;

export {Grid, Cell};
