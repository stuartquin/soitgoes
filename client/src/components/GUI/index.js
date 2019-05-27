import React from 'react';
import styled, {css} from 'styled-components';

export const theme = {
  grey: {
    darkest: '#12263f',
    dark: '#617692',
    main: '#d2ddec',
    light: '#edf1f5',
    lightest: '#f5f7fa',
  },

  primary: {
    darkest: '#12283a',
    dark: '#1a4971',
    main: '#3183c8',
    light: '#aad4f5',
    lightest: '#eff8ff',
  },

  success: {
    darkest: '#155239',
    dark: '#197741',
    main: '#38c172',
    light: '#a8eec1',
    lightest: '#e3fcec',
  },

  warning: {
    darkest: '#5c4813',
    dark: '#8c6d1f',
    main: '#f4ca64',
    light: '#fdf3d7',
    lightest: '#fffcf4',
  },

  danger: {
    darkest: '#601818',
    dark: '#881b1b',
    main: '#dc3030',
    light: '#f4a9a9',
    lightest: '#f9e5e6',
  },
};

export const SubTitle = styled.div`
  color: ${props => props.theme.grey.dark};
  font-size: 0.9em;
  margin-top: 4px;
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${props => props.theme.grey.light};
`;

export const ActionLink = styled.a`
  color: ${props => props.theme[props.type || 'primary'].main};
  cursor: pointer;
  text-decoration: underline;

  ${props => props.size === 'sm' && css`
    font-size: 0.85em;
  `}
`;

export const Button = styled.button`
  border-radius: 3px;
  padding: 8px 16px;
  border: none;
  font-weight: bold;
  cursor: pointer;

  background: ${props => props.theme[props.type || 'grey'].main};
  color: ${props => props.theme[props.type || 'grey'].darkest};

  &:hover {
    background: ${props => props.theme[props.type || 'primary'].light};
  }
`;
