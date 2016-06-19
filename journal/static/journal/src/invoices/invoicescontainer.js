'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { ToInvoice } from './toinvoice';
import { InvoiceList } from './invoicelist';
import * as invoiceActions from '../actions/invoices';
import * as projectActions from '../actions/projects';

class Invoices extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.props.fetchProjects();
  }

  render() {
    if (this.props.projects.isEmpty()) {
      return (<strong>Loading...</strong>);
    }

    return (
      <div>
        <ToInvoice
          projectSummary={this.props.projects}
          onCreateInvoice={this.props.createInvoice}
        />
        <InvoiceList
          projectSummary={this.props.projects}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ invoices }) => {
  return {
    projects: invoices.projectSummary
  };
};

const actions = {
  ...projectActions,
  ...invoiceActions
};

const InvoicesContainer = connect(mapStateToProps, actions)(Invoices);
export {InvoicesContainer};
