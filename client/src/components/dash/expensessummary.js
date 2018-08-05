'use strict';
import React from 'react';
import { Bar } from 'react-chartjs';
import moment from 'moment';


const ExpensesSummary = (props) => {
  return <div></div>;

  const expenses = Object.values(props.summary.reduce((prev, current) => {
    const date = current.date.substring(0, 7);
    if (!prev[date]) {
      prev[date] = 0;
    }
    prev[date] += current.value;
    return prev;
  }, {}));

  const labels = [
    moment().subtract(2, 'month').format('MMM'),
    moment().subtract(1, 'month').format('MMM'),
    moment().format('MMM'),
  ];

  const chartOptions = {
    responsive: true
  };
  const chartData = {
    labels,
    datasets: [{
      label: "Expenses",
      fillColor: "rgba(76,175,80,0.4)",
      pointBorderColor: "rgba(76,175,80,0.4)",
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      data: expenses.map((x) => x.toFixed(2))
    }]
  };

  return (
    <div className='panel panel-default'>
      <div className='panel-body'>
        <h5>Expense Summary</h5>
        <Bar
          data={chartData}
          width='300'
          height='240'
          options={chartOptions} />
      </div>
    </div>
  );
};

export { ExpensesSummary };
