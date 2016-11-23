'use strict';
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as dashActions from '../../actions/dash';
import { InvoiceSummary } from './invoicesummary';
import { ExpensesSummary } from './expensessummary';


class Dash extends React.Component {
  componentDidMount() {
    const invoiceStart = moment().subtract(5, 'month').startOf('month');
    const expenseStart = moment().subtract(2, 'month').startOf('month');
    const end = moment().endOf('month');

    this.props.fetchSummary(
      'invoices',
      invoiceStart.format('Y-M-D'),
      end.format('Y-M-D')
    );

    this.props.fetchExpenses(
      expenseStart.format('Y-M-D'),
      end.format('Y-M-D')
    );
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-6'>
          <InvoiceSummary
            summary={ this.props.invoiceSummary }
          />
        </div>
        <div className='col-md-6'>
          <ExpensesSummary
            expenses={ this.props.expenses }
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    invoiceSummary: state.dash.invoiceSummary,
    expenses: state.dash.expenses
  };
};

const actions = {
  ...dashActions
};

const DashContainer = connect(mapStateToProps, actions)(Dash);
export {DashContainer};
