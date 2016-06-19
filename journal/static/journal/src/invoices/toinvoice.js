'use strict';
import React from 'react';
import { ToInvoiceRow } from './toinvoicerow';

const ToInvoice = (props) => {
  return (
    <div>
      <h3>To Be Invoiced</h3>
      <table>
        <tbody>
        {props.projectSummary.valueSeq().map(project => (
          <ToInvoiceRow
            onCreateInvoice={props.onCreateInvoice}
            key={project.get('id')}
            project={project} />
        ))}
        </tbody>
      </table>
    </div>
  );
};

export {ToInvoice};
