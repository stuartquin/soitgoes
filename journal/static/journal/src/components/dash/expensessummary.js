'use strict';
import React from 'react';
import { Line } from 'react-chartjs';
import moment from 'moment';


const ExpensesSummary = (props) => {
  const expenses = props.expenses.reduce((prev, current) => {
    const date = current.date.substring(0, 7);
    if (!prev[date]) {
      prev[date] = 0;
    }
    prev[date] += current.value;
    return prev;
  }, {});

  const months = [
    moment().subtract(2, 'month').format('MMM'),
    moment().subtract(1, 'month').format('MMM'),
    moment().format('MMM'),
  ]

  debugger;

  const chartData = {
    labels: months,
    datasets: [{
      label: "Expenses",
      lineTension: 0.1,
      fillColor: "rgba(76,175,80,0.4)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "rgba(76,175,80,0.4)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
      spanGaps: false,
    }]
  };

  return (
    <div className='panel panel-default'>
      <div className='panel-body'>
        <h5>Expense Summary</h5>
        <Line
          data={chartData} />
      </div>
    </div>
  );
};

export { ExpensesSummary };
