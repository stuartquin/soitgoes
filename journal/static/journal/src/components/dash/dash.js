'use strict';
import React from 'react';
import {connect} from 'react-redux';

import * as dashActions from '../../actions/dash';

import { InvoiceSummary } from './invoicesummary';



class Dash extends React.Component {
  componentDidMount() {
    this.props.fetchSummary('invoices', '2016-03-01', '2016-11-30');
  }

  render() {
    return (
      <div className='row'>
        <InvoiceSummary
          summary={ this.props.invoiceSummary }
        />
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
