'use strict';
import React from 'react';
import { ToInvoiceRow } from './toinvoicerow';

const ToInvoice = (props) => {
  return (
    <div>
      <h3>To Be Invoiced</h3>
      <table>
      {props.projectSummary.map(project => (
        <ToInvoiceRow project={project} />
      ))}
      </table>
    </div>
  );
};

export {ToInvoice};
