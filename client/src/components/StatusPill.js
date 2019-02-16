import React from 'react';
import styled from 'styled-components';

const STATUS = {
  success: { color: '#163514', background: '#ccedc9' },
  warning: { color: '#5b371e', background: '#f9e9c4' },
  danger: { color: '#642220', background: '#fedbdd' },
};

const StatusPill = styled.div`
  border-radius: 90px;
  min-width: 40px;
  text-align: center;
  padding: 4px 8px;
  font-weight: bold;

  background: ${
    props => STATUS[props.status] ? STATUS[props.status].background : '#f5f3f5'
  };
  color: ${
    props => STATUS[props.status] ? STATUS[props.status].color : '#555355'
  };
`;

export default StatusPill;
