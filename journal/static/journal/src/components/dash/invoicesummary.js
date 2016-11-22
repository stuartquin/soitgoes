'use strict';
import React from 'react';
import { Bar } from 'react-chartjs';


const InvoiceSummary = (props) => {
  if (props.summary.get('items').isEmpty()){
    return (
      <div className='dash-invoice-summary'>
        Loading
      </div>
    );
  }

  let labels = props.summary.get('items').keySeq().sort().toJS();
  let invoiced = [];
  let paid = [];

  labels.map((month) => {
    const summary = props.summary.get('items').get(month);
    if (summary.get('issued').count()) {
      const total = summary.get('issued').reduce((prev, cur) => {
        return prev + cur.get('total_due');
      }, 0);
      invoiced.push(total);
    } else {
      invoiced.push(0);
    }

    if (summary.get('paid').count()) {
      const total = summary.get('paid').reduce((prev, cur) => {
        return prev + cur.get('total_paid');
      }, 0);
      paid.push(total);
    } else {
      paid.push(0);
    }
  });

  const chartOptions = {
  };
  const chartData = {
    labels,
    datasets: [{
      label: 'Invoiced',
      borderWidth: 1,
      data: invoiced,
      fillColor: 'rgba(220,0,0,0.8)'
    }, {
      label: 'Paid',
      borderWidth: 1,
      data: paid,
      fillColor: 'rgba(0,220,0,0.8)'
    }]
  };

  return (
    <div className='dash-invoice-summary'>
      <h4>Invoice Summary</h4>
      <Bar
        data={chartData}
        width='360'
        height='300'
        options={chartOptions} />
    </div>
  );
};

export { InvoiceSummary };
