import React from 'react';
import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 4px;
  border-radius: 3px;
  border: solid 1px #828282;
  line-height: 24px;
`;

export const Checkbox = styled.input`
  box-sizing: border-box;
  padding: 4px;
  border-radius: 3px;
  border: solid 1px #828282;
  line-height: 24px;
  width: 16px;
  height: 16px;
`;

export const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 4px;
  border-radius: 3px;
  border: solid 1px #828282;
  background: white;
  line-height: 24px;
  height: 32px;
`;

export const FormRow = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  padding-bottom: 8px;
  font-weight: 800;
  display: block;
`;
