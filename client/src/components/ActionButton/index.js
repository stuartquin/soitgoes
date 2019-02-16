import React from 'react';
import styled from 'styled-components';

const ActionButton = styled.a`
  background: #38547c;
  color: #fafcff;
  min-width: 40px;
  border-radius: 90px;
  font-size: 16px;
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background: #406eb0;
  }
`;

export default ActionButton;
