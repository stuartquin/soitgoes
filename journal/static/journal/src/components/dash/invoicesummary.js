'use strict';
import React from 'react';
import { Bar } from 'react-chartjs';
import moment from 'moment';


const InvoiceSummary = (props) => {
  if (props.summary.get('items').isEmpty()){
    return (
      <div className='dash-invoice-summary'>
        Loading
      </div>
    );
  }

  let months = props.summary.get('items').keySeq().sort();
  let invoiced = [];
  let paid = [];

  months.forEach((month) => {
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

  const labels = months.map((month) => moment(month).format('MMM')).toJS();

  const chartOptions = {
    responsive: true
  };
  const chartData = {
    labels,
    datasets: [{
      label: 'Invoiced',
      borderWidth: 1,
      data: invoiced,
      fillColor: '#f44336'
    }, {
      label: 'Paid',
      borderWidth: 1,
      data: paid,
      fillColor: '#4caf50'
    }]
  };

  return (
    <div className='dash-invoice-summary panel panel-default'>
      <div className='panel-body'>
        <h5>Invoice Summary</h5>
        <Bar
          data={chartData}
          width='300'
          height='240'
          options={chartOptions} />
      </div>
    </div>
  );
};

export { InvoiceSummary };
