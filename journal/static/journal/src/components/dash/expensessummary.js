'use strict';
import React from 'react';
import { Line } from 'react-chartjs';
import moment from 'moment';


const ExpensesSummary = (props) => {
  const chartData = {
    labels: ['a', 'b', 'c'],
    datasets: [{
      fill: false,
      lineTension: 0,
      borderCapStyle: 'butt',
      data: [3, 6, 1]
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
