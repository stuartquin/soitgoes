import React from 'react';
import moment from 'moment';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

const TimeslipDateControls = (props) => {
  const disabled = props.activeDate.isSame(props.today, 'isoweek') ? 'disabled' : '';

  return (
    <div>
      <button
        className='btn btn-default'
        disabled={disabled}
        onClick={() => {
          props.onSetActiveDate(moment().startOf('isoweek').isoWeekday(1));
        }}>Today</button>
      <button 
        className='btn btn-default'
        onClick={() => {
          props.onSetActiveDate(moment(props.activeDate).subtract(7, 'days'));
        }}>&lt;</button>
      <button
        className='btn btn-default'
        onClick={() => {
          props.onSetActiveDate(moment(props.activeDate).add(7, 'days'));
        }}>&gt;</button>
    </div>
  );
};

export {TimeslipDateControls};
