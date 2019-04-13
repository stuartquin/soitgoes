import React from 'react';
import styled from 'styled-components';

import Actions from 'components/Invoice/Actions';
import {ActionLink, Divider, SubTitle} from 'components/GUI';
import {asCurrency} from 'services/currency';
import {Input} from 'components/Form';
import {getModifierImpact, getModifierDisplayName} from 'services/modifier';
import {BREAKPOINTS} from 'components/Grid';

const InvoiceSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: 12px 16px;
`;

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
    invoice, modifiers, onChange, onRemoveModifier, onUpdateStatus,
    reference, dueDate
  } = props;
  const {project, totalTime, totalHours, totalTask} = invoice;
  const isEditable = !Boolean(invoice.issued_at);

  return (
    <Styled>
      <Actions
        invoice={invoice}
        onUpdateStatus={onUpdateStatus}
        onDelete={() => console.log('delete')}
      />

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

      {totalTime > 0 && (
        <InvoiceSummaryRow>
          <div>
            <span>Time</span>
            <SubTitle>{totalHours} Hours</SubTitle>
          </div>
          <span>
            {asCurrency(totalTime, project.currency)}
          </span>
        </InvoiceSummaryRow>
      )}

      {totalTask > 0 && (
        <InvoiceSummaryRow>
          <span>Tasks</span>
          <span>
            {asCurrency(totalTask, project.currency)}
          </span>
        </InvoiceSummaryRow>
      )}

      <InvoiceSummaryRow>
        <strong>Subtotal</strong>
        <span>{asCurrency(invoice.subtotal_due, project.currency)}</span>
      </InvoiceSummaryRow>

      {modifiers.length > 0 && (
        <React.Fragment>
          <Divider />
          {modifiers.map(modifier => (
            <InvoiceSummaryRow key={modifier.id}>
              <div>
                <span>{getModifierDisplayName(modifier)}</span>
                {isEditable && (
                  <div>
                    <ActionLink size="sm" onClick={() => onRemoveModifier(modifier.id)}>
                      Remove
                    </ActionLink>
                  </div>
                )}
              </div>
              <span>
                {asCurrency(getModifierImpact(modifier, invoice.subtotal_due), project.currency)}
              </span>
            </InvoiceSummaryRow>
          ))}
        </React.Fragment>
      )}

      <Divider />
      <InvoiceSummaryRow>
        <strong>Total</strong>
        <span>{asCurrency(invoice.total_due, project.currency)}</span>
      </InvoiceSummaryRow>

    </Styled>
  );
};

export default Settings;
