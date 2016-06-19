'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { InvoiceInfo } from './invoiceinfo';
import * as invoiceActions from '../actions/invoices';
import * as projectActions from '../actions/projects';

class Invoice extends React.Component {
  componentDidMount() {
    if (this.props.invoice.isEmpty()) {
      this.fetchInvoice().then(() => {
        this.fetchData();
      });
    } else {
      this.fetchData();
    }
  }

  fetchInvoice() {
    return this.props.fetchInvoice(this.props.invoiceId);
  }

  fetchData() {
  }

  render() {
    if (!this.props.invoice.get('project')) {
      return (<strong>Loading...</strong>);
    }

    return (
      <div>
        <h2>Invoice (Draft)</h2>
        <InvoiceInfo
          project={this.props.invoice.get('project')}
          created={this.props.invoice.get('created_at')}
          issued={this.props.invoice.get('issued_at')}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ invoices }, { params }) => {
  return {
    invoice: invoices.invoice,
    invoiceId: params.invoiceId
  };
};

const actions = {
  ...projectActions,
  ...invoiceActions
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
