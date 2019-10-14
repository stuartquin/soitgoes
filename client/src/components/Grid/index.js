import React from 'react';
import {Box} from 'rebass/styled-components';
import styled, {css} from 'styled-components';

export const BREAKPOINTS = {
  xs: '0px',
  sm: '768px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 20px;
  width: 100%;

  ${props => props.gap && css`
    grid-gap: ${props.gap};
  `}

  flex-grow: 1;
`;


export const Cell = styled(Box)`
  grid-column: span 12;

  ${props => props.numeric && css`
    text-align: right;
  `}

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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px;
  margin: auto;

  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;
`;

