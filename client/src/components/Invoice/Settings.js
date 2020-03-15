import React from 'react';
import styled from 'styled-components';
import { Card } from 'rebass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import Summary from 'components/Invoice/Summary';
import { Divider, SettingsCard } from 'components/GUI';
import { Input } from 'components/Form';
import { BREAKPOINTS } from 'components/Grid';

const InvoiceInputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;

  padding: 12px 16px;
`;

const Settings = props => {
  const {
    invoice,
    project,
    modifiers,
    reference,
    dueDate,
    tasks,
    onChange,
    onRemoveModifier,
  } = props;
  const isIssued = Boolean(invoice.issued_at);

  return (
    <SettingsCard>
      <InvoiceInputRow>
        <div>Due Date</div>
        <Input
          type="date"
          name="due_date"
          value={dueDate || ''}
          onChange={onChange}
          disabled={isIssued}
        />
      </InvoiceInputRow>

      <InvoiceInputRow>
        <div>Reference</div>
        <Input
          type="text"
          name="reference"
          value={reference || ''}
          onChange={onChange}
          disabled={isIssued}
        />
      </InvoiceInputRow>

      <Divider />

      <Summary
        modifiers={modifiers}
        invoice={invoice}
        project={project}
        tasks={tasks}
        onRemoveModifier={onRemoveModifier}
      />
    </SettingsCard>
  );
};

export default Settings;
