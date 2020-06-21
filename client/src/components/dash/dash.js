'use strict';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Card, CardText } from 'material-ui/Card';

import * as dashActions from '../../actions/dash';
import { SummaryBarChart } from './summarybarchart';

class Dash extends React.Component {
  componentDidMount() {
    const invoiceStart = moment().subtract(5, 'month').startOf('month');
    const expenseStart = moment().subtract(3, 'month').startOf('month');
    const end = moment().endOf('month');

    this.props.fetchSummary(
      'invoices',
      invoiceStart.format('Y-M-D'),
      end.format('Y-M-D')
    );

    this.props.fetchSummary(
      'expenses',
      expenseStart.format('Y-M-D'),
      end.format('Y-M-D')
    );
  }

  render() {
    return (
      <div className="dash-container">
        <div className="content">
          <Card className="dash-card">
            <CardText>
              <SummaryBarChart
                title="Invoices Paid"
                summary={this.props.invoiceSummary}
                totalField="total_paid"
                threshold={8350}
              />
            </CardText>
          </Card>
          <Card className="dash-card">
            <CardText>
              <SummaryBarChart
                title="Expenses"
                summary={this.props.expensesSummary}
                totalField="value"
                threshold={0}
              />
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => {
  return {
    invoiceSummary: state.dash.summary.get('invoices'),
    expensesSummary: state.dash.summary.get('expenses'),
  };
};

const actions = {
  ...dashActions,
};

const DashContainer = connect(mapStateToProps, actions)(Dash);
export { DashContainer };
