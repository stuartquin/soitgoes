'use strict';
import React from 'react';
import {connect} from 'react-redux';

import * as dashActions from '../../actions/dash';

import { InvoiceSummary } from './invoicesummary';



class Dash extends React.Component {
  componentDidMount() {
    this.props.fetchSummary('invoices', '2016-03-01', '2017-02-28');
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-4'>
          <h3>Dash</h3>
        </div>
        <div className='col-md-8'>
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
