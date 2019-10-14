import React from 'react';
import styled, {css} from 'styled-components';
import { Text } from 'rebass/styled-components';
import {BREAKPOINTS} from 'components/Grid';

const STATUS = {
  success: { color: '#163514', background: '#ccedc9' },
  warning: { color: '#5b371e', background: '#f9e9c4' },
  danger: { color: '#642220', background: '#fedbdd' },
};

const StatusPill = styled(Text)`
  border-radius: 90px;
  min-width: 40px;
  text-align: center;
  padding: 8px 12px;
  box-shadow: 0 2px 1px hsla(0,0%,40%,.2);
  text-transform: uppercase;

  background: ${
    props => STATUS[props.status] ? STATUS[props.status].background : '#f5f3f5'
  };
  color: ${
    props => STATUS[props.status] ? STATUS[props.status].color : '#555355'
  };

  ${props => props.size === 'lg' && css`
    font-size: 12px;
    padding: 14px 20px;
  `}
`;

export default StatusPill;
