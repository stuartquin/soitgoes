'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { InvoiceList } from './invoicelist';
import { CreateInvoice } from './createinvoice';
import * as invoiceActions from '../../actions/invoices';

class Invoices extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    return Promise.all([
      this.props.fetchInvoices()
    ]);
  }

  render() {
    if (this.props.projects.isEmpty()) {
      return (<strong>Loading...</strong>);
    }

    return (
      <div className='row'>
        <div className='col-sm-4'>
          <CreateInvoice
            projects={this.props.projects}
            onCreateInvoice={this.props.createInvoice}
          />
        </div>

        <div className='col-sm-8'>
          <InvoiceList
            projects={this.props.projects}
            invoices={this.props.invoices}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects.get('items'),
    invoices: state.invoices.items
  };
};

const actions = {
  ...invoiceActions
};

const InvoicesContainer = connect(mapStateToProps, actions)(Invoices);
export {InvoicesContainer};
