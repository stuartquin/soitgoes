'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { InvoiceInfo } from './invoiceinfo';
import { InvoiceTimeslips } from './invoicetimeslips';
import * as invoiceActions from '../actions/invoices';
import * as projectActions from '../actions/projects';

import styles from './styles.css';

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
    const project = this.props.invoice.get('project');
    return Promise.all([
      this.props.fetchProjectTimeslips(project),
      this.props.fetchInvoiceTimeslips(this.props.invoiceId)
    ]);
  }

  render() {
    if (!this.props.project) {
      return (<strong>Loading...</strong>);
    }
    const invoice = this.props.invoice;
    const project = this.props.project;

    return (
      <div className={styles.invoiceContainer}>
        <InvoiceInfo
          project={project}
          created={invoice.get('created_at')}
          issued={invoice.get('issued_at')}
          onMarkAsIssued={() =>
            this.props.markAsIssued(invoice.get('id'), project.get('id'))
          }
        />
        <InvoiceTimeslips
          project={this.props.project}
          timeslips={this.props.timeslips}
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
    timeslips: invoices.timeslips,
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
