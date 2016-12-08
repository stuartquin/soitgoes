'use strict';
import React from 'react';
import { Bar } from 'react-chartjs';
import moment from 'moment';

const MONTHLY_LOW = 8350;
const MONTHLY_HIGH = 10000;

const InvoiceSummary = (props) => {
  if (props.summary.get('items').isEmpty()){
    return (
      <div className='dash-invoice-summary'>
        Loading
      </div>
    );
  }

  let months = props.summary.get('items').keySeq().sort();
  const paid = months.map((month) => {
    const summary = props.summary.get('items').get(month);
    if (summary.get('paid').count()) {
      const total = summary.get('paid').reduce((prev, cur) => {
        return prev + cur.get('total_paid');
      }, 0);
      return total;
    }
    return 0;
  }).toArray();

  const labels = months.map((month) => moment(month).format('MMM')).toJS();
  const colors = paid.map((amount) => {
    if (amount < MONTHLY_LOW) {
      return 'rgba(244,67,54,0.4)';
    }
    if (amount > MONTHLY_HIGH) {
      return 'rgba(76,175,80,0.4)';
    }

    return 'rgba(76,175,80,0.4)';
  });

  const chartOptions = {
    responsive: true
  };
  const chartData = {
    labels,
    datasets: [{
      label: 'Paid',
      borderWidth: 1,
      data: paid,
      fillColor: colors
    }]
  };

  return (
    <div className='dash-invoice-summary panel panel-default'>
      <div className='panel-body'>
        <h5>Invoices Paid</h5>
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
