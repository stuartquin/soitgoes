import React from 'react';
import styled from 'styled-components';

import InvoiceModifiers from './invoicemodifiers';
import {Button, ActionLink, Divider, SubTitle} from 'components/GUI';
import { asCurrency } from 'services/currency';
import { getModifierImpact, getModifierDisplayName } from 'services/modifier';

const InvoiceSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: 12px 16px;
`;

const Styled = styled.div`
  background: white;
  color: #4e5767;
  height: 100%;
  width: 290px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  color: #464d59;
  padding: 12px 16px;
  text-align: center;
`;

const Settings = (props) => {
  const {
    invoice, timeslips, project, modifiers, tasks, reference,
    onSetReference, onRemoveModifier, onUpdateStatus
  } = props;
  const {modifier = []} = invoice;
  const isEditable = !Boolean(invoice.issued_at);
  const totalHours = timeslips.reduce((prev, current) =>
    prev + current.hours
  , 0);
  const taskTotal = tasks.reduce((prev, current) =>
    prev + current.cost
  , 0);
  const timeTotal = project.hourly_rate * totalHours;

  return (
    <Styled>
      <Actions>
        <ActionLink size="sm" type="danger">Delete</ActionLink>
        <Button type="success" onClick={() => onUpdateStatus('ISSUED')}>
          Issue
        </Button>
      </Actions>

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
                    <ActionLink size="sm" onClick={() => onRemoveModifier(modifier)}>
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
