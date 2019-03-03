import React from 'react';
import styled from 'styled-components';

import InvoiceModifiers from './invoicemodifiers';
import { asCurrency } from 'services/currency';

const getModifierImpact = (subTotal, modifier) => {
  return (subTotal / 100 * modifier.percent);
};

const InvoiceSummaryTotal = ({ currency, value, title }) => {
  return (
    <div className='invoice-summary-total'>
      <strong className='title'>{title}</strong>
      <span className='value'>{`${asCurrency(value, currency)}`}</span>
    </div>
  );
};


const InvoiceSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 16px;
`;

const Styled = styled.div`
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  background: white;
`;

const Actions = styled.div`
  display: block;
  font-size: 16px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  background: #f5f3f5;
  color: #464d59;
  padding: 12px 16px;
  text-align: center;
`;

const InvoiceSummary = (props) => {
  const {invoice, timeslips, project, modifiers, tasks} = props;
  const {modifier = []} = invoice;

  const activeModifiers = modifiers.filter((mod) =>
    modifier.includes(mod.id)
  );
  const isEditable = !Boolean(invoice.issued_at);

  const totalHours = timeslips.reduce((prev, current) =>
    prev + current.hours
  , 0);

  const taskTotal = tasks.reduce((prev, current) =>
    prev + current.cost
  , 0);

  const subTotal = taskTotal + (project.hourly_rate * totalHours);
  const total = activeModifiers.reduce((prev, current) =>
    prev + getModifierImpact(subTotal, current)
  , subTotal);
  const timeTotal = project.hourly_rate * totalHours;

  return (
    <Styled>
      <ul>
        <li key={0}>
          <strong>Time: </strong>
          {`${totalHours} Hours -  ${asCurrency(timeTotal, project.currency)}`}
        </li>
        <li key={1}>
          <strong>Tasks: </strong>
          {`${tasks.length} Tasks - ${asCurrency(taskTotal, project.currency)}`}
        </li>
      </ul>

      <hr />
      <InvoiceSummaryRow>
        <strong>Subtotal</strong>
        <span>{asCurrency(subTotal, project.currency)}</span>
      </InvoiceSummaryRow>

      <InvoiceModifiers
        invoice={invoice}
        modifiers={modifiers}
        isEditable={isEditable}
        onAddModifier={props.onAddModifier}
        onRemoveModifier={props.onRemoveModifier}
      />

      <hr />
      <InvoiceSummaryRow>
        <strong>Total</strong>
        <span>{asCurrency(total, project.currency)}</span>
      </InvoiceSummaryRow>

      <Actions />
    </Styled>
  );
};

export {InvoiceSummary};
