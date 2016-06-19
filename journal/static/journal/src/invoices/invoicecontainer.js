'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { ToInvoice } from './toinvoice';
import { InvoiceList } from './invoicelist';
import * as invoiceActions from '../actions/invoices';
import * as projectActions from '../actions/projects';

class Invoice extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
  }

  render() {
    return (
      <div>
        <h2>Invoice (Draft)</h2>
      </div>
    );
  }
}

const mapStateToProps = ({ invoices }) => {
  debugger;
  return {
  };
};

const actions = {
  ...projectActions,
  ...invoiceActions
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
