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
    if (!this.props.project) {
      return (<strong>Loading...</strong>);
    }

    return (
      <div>
        <h2>Invoice (Draft)</h2>
        <InvoiceInfo
          project={this.props.project}
          created={this.props.invoice.get('created_at')}
          issued={this.props.invoice.get('issued_at')}
        />
      </div>
    );
  }
}

const getInvoiceProject = (projects, invoice) => {
  return projects.find((x) => x.get('id') === invoice.get('project'));
};

const mapStateToProps = ({ invoices }, { params }) => {
  return {
    invoice: invoices.invoice,
    project: getInvoiceProject(invoices.projectSummary, invoices.invoice),
    invoiceId: params.id
  };
};

const actions = {
  ...projectActions,
  ...invoiceActions
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
