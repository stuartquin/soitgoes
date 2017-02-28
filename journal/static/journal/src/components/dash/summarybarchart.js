'use strict';
import React from 'react';
import { Bar } from 'react-chartjs';
import moment from 'moment';

import {Loading} from '../loading';

const MONTHLY_LOW = 8350;
const MONTHLY_HIGH = 10000;

const SummaryBarChart = (props) => {
  if (props.summary.isEmpty()){
    return (<Loading />);
  }

  let months = props.summary.keySeq().sort();
  const values = months.map((month) => {
    const summary = props.summary.get(month);
    if (summary.count()) {
      const total = summary.get('items').reduce((prev, cur) => {
        return prev + cur.get(props.totalField);
      }, 0);
      return total.toFixed(2);
    }
    return 0;
  }).toArray();

  const labels = months.map((month) => moment(month).format('MMM')).toJS();
  const colors = values.map((amount) => {
    if (amount < props.threshold) {
      return 'rgba(244,67,54,0.4)';
    }
    return 'rgba(76,175,80,0.4)';
  });

  const chartOptions = {
    responsive: true
  };
  const chartData = {
    labels,
    datasets: [{
      borderWidth: 1,
      data: values,
      fillColor: colors
    }]
  };

  return (
    <div className='summary-chart'>
      <h5>{props.title}</h5>
      <Bar
        data={chartData}
        options={chartOptions} />
    </div>
  );
};

export { SummaryBarChart };
