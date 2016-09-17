'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { InvoiceList } from './invoicelist';
import { CreateInvoice } from './createinvoice';
import * as invoiceActions from '../../actions/invoices';
import * as projectActions from '../../actions/projects';

class Invoices extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    return Promise.all([
      this.props.fetchProjects(),
      this.props.fetchInvoices()
    ]);
  }

  render() {
    if (this.props.projects.isEmpty()) {
      return (<strong>Loading...</strong>);
    }

    return (
      <div>
        <div className='col-sm-3'>
          <CreateInvoice
            projectSummary={this.props.projects}
            onCreateInvoice={this.props.createInvoice}
          />
        </div>

        <div className='col-sm-9'>
          <InvoiceList
            projects={this.props.projects}
            invoices={this.props.invoices}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ invoices }) => {
  return {
    projects: invoices.projects,
    invoices: invoices.items
  };
};

const actions = {
  ...projectActions,
  ...invoiceActions
};

const InvoicesContainer = connect(mapStateToProps, actions)(Invoices);
export {InvoicesContainer};
