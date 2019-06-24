import React from 'react';
import styled from 'styled-components';

import Summary from 'components/Invoice/Summary';
import {Divider} from 'components/GUI';
import {Input} from 'components/Form';
import {BREAKPOINTS} from 'components/Grid';

const InvoiceInputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;

  padding: 12px 16px;
`;

const Styled = styled.div`
  background: white;
  color: #4e5767;
  height: 100%;
  width: 290px;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);

  @media(max-width: ${BREAKPOINTS.sm}) {
    height: auto;
    width: 100%;
    margin-bottom: 16px;
  }
`;

const Settings = (props) => {
  const {
    invoice, modifiers, onChange, onRemoveModifier, reference, dueDate
  } = props;
  const isEditable = !Boolean(invoice.issued_at);

  return (
    <Styled>
      <Summary
        modifiers={modifiers}
        invoice={invoice}
        onRemoveModifier={onRemoveModifier}
      />

      <Divider />

      <InvoiceInputRow>
        <div>Due Date</div>
        <Input
          type="date"
          name="due_date"
          value={dueDate || ''}
          onChange={onChange}
          disabled={!isEditable}
        />
      </InvoiceInputRow>

      <InvoiceInputRow>
        <div>Reference</div>
        <Input
          type="text"
          name="reference"
          value={reference || ''}
          onChange={onChange}
          disabled={!isEditable}
        />
      </InvoiceInputRow>
    </Styled>
  );
};

export default Settings;
