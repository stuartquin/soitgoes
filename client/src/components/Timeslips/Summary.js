import React from 'react';
import styled from 'styled-components';
import {Button, ActionLink} from 'components/GUI';
import {BREAKPOINTS} from 'components/Grid';
import SummaryRow from './SummaryRow';

const Styled = styled.div`
  background: white;
  color: #4e5767;
  width: 290px;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  padding: 12px 16px;

  @media(max-width: ${BREAKPOINTS.sm}) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    box-shadow: 0 2px 4px hsla(0,0%,40%,0.14);

    box-shadow: none;
    width: auto;

    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    margin-left: -16px;
    border-radius: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

const Summary = ({summary, onSave}) => {
  return (
    <Styled>
      <Actions>
        <Button type="success" onClick={onSave}>
          Save
        </Button>
      </Actions>

      {Object.keys(summary).map(key => (
        <SummaryRow
          key={key}
          title={key}
          hours={summary[key].hours}
          total={summary[key].total}
        />
      ))}
    </Styled>
  );
};

export default Summary;
