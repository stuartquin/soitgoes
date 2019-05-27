import React from 'react';
import styled from 'styled-components';
import {Button, ActionLink, Divider, SubTitle} from 'components/GUI';
import {asCurrency} from 'services/currency';
import {BREAKPOINTS} from 'components/Grid';

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: 12px 16px;

  @media(max-width: ${BREAKPOINTS.sm}) {
    padding: 0;
    flex-grow: 1;
    margin-right: 12px;
    align-items: center;
    &:last-child {
      display: none;
    }
  }
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
