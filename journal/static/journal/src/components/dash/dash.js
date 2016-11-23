'use strict';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as dashActions from '../../actions/dash';
import { InvoiceSummary } from './invoicesummary';


class Dash extends React.Component {
  componentDidMount() {
    const start = moment().subtract(5, 'month').startOf('month')
    const end = moment().endOf('month');

    this.props.fetchSummary(
      'invoices',
      start.format('Y-M-D'),
      end.format('Y-M-D')
    );
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-4'>
          <InvoiceSummary
            summary={ this.props.invoiceSummary }
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    invoiceSummary: state.dash.invoiceSummary
  };
};

const actions = {
  ...dashActions
};

const DashContainer = connect(mapStateToProps, actions)(Dash);
export {DashContainer};
