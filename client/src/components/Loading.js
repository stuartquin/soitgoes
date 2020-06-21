import React from 'react';
import { Box } from 'rebass';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
`;

const Styled = styled(Box)`
  animation: ${pulse} 2.5s linear infinite;
  background: ${(props) => props.theme.colors.grey_main};

  height: 100%;
  width: 100%;
  margin: 4px;
`;

const Loading = (props) => {
  return <Styled variant="loading" {...props} />;
};

export default Loading;
