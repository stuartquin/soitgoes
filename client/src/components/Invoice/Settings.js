import React from 'react';
import styled from 'styled-components';

import {Button, ActionLink, Divider, SubTitle} from 'components/GUI';
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
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;

  @media(max-width: ${BREAKPOINTS.sm}) {
    height: auto;
    width: 100%;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  border-top-left-radius: 6px;
  color: #464d59;
  padding: 12px 16px;
  text-align: center;
`;

const getStatusAction = (invoice, onUpdateStatus) => {
  if (!invoice.status) {
    return (
      <Button type="success" onClick={() => onUpdateStatus('ISSUED')}>
        Issue
      </Button>
    );
  }
  if (invoice.status === 'ISSUED') {
    return (
      <Button type="success" onClick={() => onUpdateStatus('PAID')}>
        Set Paid
      </Button>
    );
  }

  return null;
};

const Settings = (props) => {
  const {
    invoice, reference, onChange, onRemoveModifier, onUpdateStatus
  } = props;
  const {modifiers, tasks, timeslips, project} = invoice;
  const isEditable = !Boolean(invoice.issued_at);
  const totalHours = timeslips.reduce((prev, current) =>
    prev + current.hours
  , 0);
  const taskTotal = tasks.reduce((prev, current) =>
    prev + current.cost
  , 0);
  const timeTotal = project.hourly_rate * totalHours;
  const downloadURL = `/api/invoices/${invoice.id}/pdf`;

  return (
    <Styled>
      <Actions>
        <ActionLink size="sm" type="danger">Delete</ActionLink>
        <a href={downloadURL} download>Download</a>
        {getStatusAction(invoice, onUpdateStatus)}
      </Actions>

      <InvoiceInputRow>
        <div>Due Date</div>
        <Input
          type="date"
          name="due_date"
          value={invoice.due_date}
          onChange={onChange}
          disabled={!isEditable}
        />
      </InvoiceInputRow>

      <InvoiceInputRow>
        <div>Reference</div>
        <Input
          type="text"
          name="reference"
          value={invoice.reference}
          onChange={onChange}
          disabled={!isEditable}
        />
      </InvoiceInputRow>

      <InvoiceSummaryRow>
        <div>
          <span>Time</span>
          <SubTitle>{totalHours} Hours</SubTitle>
        </div>
        <span>
          {asCurrency(timeTotal, project.currency)}
        </span>
      </InvoiceSummaryRow>

      <InvoiceSummaryRow>
        <span>Tasks</span>
        <span>
          {asCurrency(taskTotal, project.currency)}
        </span>
      </InvoiceSummaryRow>

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
