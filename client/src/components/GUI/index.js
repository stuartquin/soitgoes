import React from 'react';
import styled, { css } from 'styled-components';
import * as rebass from 'rebass/styled-components';

export const colors = {
  grey_darkest: '#12263f',
  grey_dark: '#617692',
  grey_main: '#d2ddec',
  grey_light: '#edf1f5',
  grey_lightest: '#f5f3f5',

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

  text_dark: '#323843',
  text_main: '#4e5767',
  text_light: '#637088',
};

export const theme = {
  colors,
  breakpoints: ['768px', '992px'],

  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],

  fontWeights: [400, 600, 800],

  space: [0, 4, 8, 12, 16, 32, 64, 128, 256],

  text: {
    label: {
      fontWeight: 2,
      color: 'grey_darkest',
      minWidth: 'auto',
    },
    link: {
      color: 'brand_dark',
      cursor: 'pointer',
    },
    uppercase: {
      textTransform: 'uppercase',
    },
    amount: {
      fontSize: [1, 2],
      textAlign: 'right',
    },
    title: {
      fontSize: [1, 2],
    },
    h2: {
      fontSize: [2, 3],
      fontWeight: 1,
    },
    subTitle: {
      color: 'grey_dark',
      fontSize: [0, 1],
      marginTop: 1,
    },
  },

  shadows: {
    container: '0 6px 4px hsla(0,0%,40%,.2)',
    settings: '0 6px 4px hsla(0,0%,40%,.2)',
  },

  variants: {
    smallShadow: {
      boxShadow: '0 2px 1px hsla(0,0%,40%,.1)',
    },
    shadow: {
      boxShadow: '0 6px 4px hsla(0,0%,40%,.2)',
    },
    loading: {
      boxShadow: '0 6px 4px hsla(0,0%,40%,.2)',
      borderRadius: '2px',
    },
    divider: {
      borderBottomStyle: 'solid',
      borderBottomColor: 'grey_lightest',
      borderBottomWidth: '1px',
    },
    ellipsis: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    card: {
      color: 'text',
      px: 2,
      py: [1, 2],
      boxShadow: 'container',
    },
  },

  buttons: {
    success: {
      backgroundColor: 'success_dark',
      color: 'success_lightest',
      cursor: 'pointer',
    },

    primary: {
      backgroundColor: 'brand_dark',
      color: 'brand_lightest',
      cursor: 'pointer',
    },
  },
};

export const SubTitle = styled(rebass.Text)`
  color: ${(props) => props.theme.colors.grey_dark};
  font-size: ${(props) => props.theme.colors.grey_dark};
  margin-top: 4px;
`;

export const Error = styled.div`
  color: ${(props) => props.theme.colors.danger_main};
`;

export const Divider = styled(rebass.Box)`
  border: 0;
  height: 1px;
  background-color: ${(props) => props.theme.colors.grey_lightest};
`;

export const ActionLink = styled(rebass.Link)`
  color: ${(props) => props.theme.colors.brand_main};
  cursor: pointer;
  text-decoration: none;

  &:visited {
    color: ${(props) => props.theme.colors.brand_main};
  }

  &:hover {
    text-decoration: underline;
  }

  ${(props) =>
    props.size === 'sm' &&
    css`
      font-size: 0.85em;
    `}
`;

export const Button = styled(rebass.Button)`
  cursor: pointer;
  line-height: 22px;
`;

export const SettingsCard = styled(rebass.Card)`
  box-shadow: ${(props) => props.theme.shadows.settings};
  background: white;
  color: #4e5767;
  height: 100%;
  width: 290px;
  min-width: 290px;
  box-shadow: 0 6px 4px hsla(0, 0%, 40%, 0.2);

  @media (max-width: ${(props) => props.theme.breakpoints[0]}) {
    height: auto;
    width: 100%;
    margin-bottom: 0;
    box-shadow: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;
