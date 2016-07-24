'use strict';
import React from 'react';

import { InvoiceSummaryRow } from './invoicesummaryrow';


const getTotal = (timeslipTotal, additionalTotal, modifiers) => {
  return modifiers.reduce((runningTotal, modifier) =>
    runningTotal + ((runningTotal / 100) * modifier.get('percent')),
  timeslipTotal + additionalTotal);
};

const InvoiceSummary = (props) => {
  const project = props.project;

  const total = getTotal(
    props.timeslipTotal,
    props.additionalTotal,
    project.get('invoice_modifier')
  );

  return (
    <table className='table table-striped'>
    <tbody>
      <InvoiceSummaryRow
        key={0}
        name='Timeslips'
        value={'£' + props.timeslipTotal}
      />
      <InvoiceSummaryRow
        key={1}
        name='Additional'
        value={'£' + props.additionalTotal}
      />
      {project.get('invoice_modifier').map((modifier) => (
        <InvoiceSummaryRow
          key={2 + modifier.get('id')}
          name={modifier.get('name')}
          value={modifier.get('percent') + '%'}
        />
      ))}

      <InvoiceSummaryRow
        name='Total'
        value={'£' + total}
      />
    </tbody>
    </table>
  );
};

export {InvoiceSummary};
