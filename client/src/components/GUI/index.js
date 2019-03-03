import React from 'react';
import styled, {css} from 'styled-components';

export const SubTitle = styled.div`
  color: #828282;
  font-size: 0.9em;
  margin-top: 4px;
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #f5f3f5;
`;

export const ActionLink = styled.a`
  color: #464d59;
  cursor: pointer;
  text-decoration: underline;

  ${props => props.size === 'sm' && css`
    font-size: 0.85em;
  `}

  ${props => props.type === 'success' && css`
    background: #38c172;
    color:  #155239;
  `}

  ${props => props.type === 'danger' && css`
    color:  #dc3030;
  `}
`;

export const Button = styled.button`
  border-radius: 4px;
  padding: 8px 16px;
  border: none;
  font-weight: bold;

  background: #6cd4d0;
  color:  #124544;
  cursor: pointer;

  ${props => props.type === 'success' && css`
    background: #38c172;
    color:  #155239;

    &:hover {
      background: #74d99f;
    }
  `}
`;
