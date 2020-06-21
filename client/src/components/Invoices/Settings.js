import React from 'react';
import styled from 'styled-components';

import Summary from 'components/Invoice/Summary';
import { Divider } from 'components/GUI';
import { Input } from 'components/Form';
import { BREAKPOINTS } from 'components/Grid';

const Styled = styled.div`
  background: white;
  color: #4e5767;
  height: 100%;
  width: 290px;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0, 0%, 40%, 0.2);

  @media (max-width: ${BREAKPOINTS.sm}) {
    height: auto;
    width: 100%;
    margin-bottom: 0;
    box-shadow: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const Settings = (props) => {
  return (
    <Styled>
      <div>
        <div>Upcoming</div>
        <div>...</div>
      </div>
    </Styled>
  );
};

export default Settings;
