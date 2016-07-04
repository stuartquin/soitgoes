'use strict';
import React from 'react';
import { ToInvoiceItem } from './toinvoiceitem';
import { ToInvoiceLabels } from './toinvoicelabels';

import styles from './styles.css';

const ToInvoice = (props) => {
  const toInvoiceStyle = `row ${styles.toInvoice}`;

  return (
    <div className={ toInvoiceStyle }>
        <ToInvoiceLabels />
        {props.projectSummary.valueSeq().map(project => (
          <ToInvoiceItem
            onCreateInvoice={props.onCreateInvoice}
            key={project.get('id')}
            project={project} />
        ))}
    </div>
  );
};

export {ToInvoice};
