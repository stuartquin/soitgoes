import React from 'react';
import styled, {css} from 'styled-components';
import * as rebass from 'rebass/styled-components';

export const colors = {
  grey_darkest: '#12263f',
  grey_dark: '#617692',
  grey_main: '#d2ddec',
  grey_light: '#edf1f5',
  grey_lightest: '#f5f7fa',

  brand_darkest: '#12283a',
  brand_dark: '#1a4971',
  brand_main: '#3183c8',
  brand_light: '#aad4f5',
  brand_lightest: '#eff8ff',

  brand_dark: '#1a4971',

  success_darkest: '#155239',
  success_dark: '#197741',
  success_main: '#38c172',
  success_light: '#a8eec1',
  success_lightest: '#e3fcec',

  warning_darkest: '#5c4813',
  warning_dark: '#8c6d1f',
  warning_main: '#f4ca64',
  warning_light: '#fdf3d7',
  warning_lightest: '#fffcf4',

  danger_darkest: '#601818',
  danger_dark: '#881b1b',
  danger_main: '#dc3030',
  danger_light: '#f4a9a9',
  danger_lightest: '#f9e5e6',

  primary: '#3183c8',
};

export const theme = {
  colors,
};

export const SubTitle = styled.div`
  color: ${props => props.theme.colors.grey_dark};
  font-size: 0.9em;
  margin-top: 4px;
`;

export const Error = styled.div`
  color: ${props => props.theme.colors.danger_main};
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${props => props.theme.colors.grey_lightest};
`;

export const ActionLink = styled.a`
  color: ${props => props.theme.colors.primary_main};
  cursor: pointer;
  text-decoration: underline;

  ${props => props.size === 'sm' && css`
    font-size: 0.85em;
  `}
`;

export const Button = styled(rebass.Button)`
  cursor: pointer;
`;
