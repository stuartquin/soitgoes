import React from 'react';
import styled from 'styled-components';
import {Button, ActionLink, Divider, SubTitle} from 'components/GUI';
import {asCurrency} from 'services/currency';

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: 12px 16px;
`;

const SummaryRow = ({title, hours, total}) => {
  return (
    <Styled>
      <div>
        <strong>{title}</strong>
        <SubTitle>{hours} Hours</SubTitle>
      </div>
      <span>
        {asCurrency(total, 'GBP')}
      </span>
    </Styled>
  );
};

export default SummaryRow;
