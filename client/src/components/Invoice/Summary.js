import React from 'react';
import styled from 'styled-components';

import {ActionLink, Divider, SubTitle} from 'components/GUI';
import {asCurrency} from 'services/currency';
import {getModifierImpact, getModifierDisplayName} from 'services/modifier';

const InvoiceSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: 12px 16px;
`;

const Summary = ({invoice, modifiers, onRemoveModifier}) => {
  const {project, totalTime, totalHours, totalTask} = invoice;
  const isEditable = !Boolean(invoice.issued_at);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default Summary;
