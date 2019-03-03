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
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  background: white;
  color: #4e5767;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #f5f3f5;
  color: #464d59;
  padding: 12px 16px;
  text-align: center;
`;

const Settings = (props) => {
  const {
    invoice, timeslips, project, modifiers, tasks, reference,
    onSetReference, onRemoveModifier
  } = props;
  const {modifier = []} = invoice;
  const isEditable = !Boolean(invoice.issued_at);

  const totalHours = timeslips.reduce((prev, current) =>
    prev + current.hours
  , 0);

  const taskTotal = tasks.reduce((prev, current) =>
    prev + current.cost
  , 0);

  const subTotal = taskTotal + (project.hourly_rate * totalHours);
  const total = modifiers.reduce((prev, mod) => (
    prev + getModifierImpact(mod, subTotal)
  ), subTotal);
  const timeTotal = project.hourly_rate * totalHours;

  return (
    <Styled>

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
        <span>{asCurrency(subTotal, project.currency)}</span>
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
                {asCurrency(getModifierImpact(modifier, subTotal), project.currency)}
              </span>
            </InvoiceSummaryRow>
          ))}
        </React.Fragment>
      )}

      <Divider />
      <InvoiceSummaryRow>
        <strong>Total</strong>
        <span>{asCurrency(total, project.currency)}</span>
      </InvoiceSummaryRow>

      <Actions>
        <ActionLink type="danger">Delete</ActionLink>
        <Button type="success">Issue</Button>
      </Actions>
    </Styled>
  );
};

export default Settings;
