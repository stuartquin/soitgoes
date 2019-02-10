'use strict';
import React from 'react';
import {TimeslipGridCell} from './timeslipgridcell';

const TimeslipGridRow = (props) => {
  const dates = props.range.map((m) => m.format('YYYY-MM-DD'));
  const filledTimeslips = props.timeslips.reduce( (result, item) => {
    result[item.date] = item;
    return result;
  }, {});

  return (
    <tr className='timeslip-grid-row'>
      <td className='timeslip-grid-row-project'>
        {props.project.name}
      </td>
      {dates.map((date) => (
        <TimeslipGridCell
          isLoading={props.isLoading}
          key={date}
          date={date}
          today={props.today.format('YYYY-MM-DD')}
          onHourChanged={(value, timeslip) => {
            props.onHourChanged(value, date, timeslip);
          }}
          timeslip={filledTimeslips[date]} />
      ))}
      <td>{props.project.uninvoiced_hours}</td>
    </tr>
  );
};

export {TimeslipGridRow};
