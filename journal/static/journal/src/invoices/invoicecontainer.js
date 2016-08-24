'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { InvoiceInfo } from './invoiceinfo';
import { InvoiceTimeslips } from './invoicetimeslips';
import * as invoiceActions from '../actions/invoices';
import * as projectActions from '../actions/projects';

import styles from './styles.css';

const getTimeslipTotal = (hourlyRate, timeslips) => {
  return timeslips.reduce((prev, current) =>
    prev + (current.get('hours') * hourlyRate),
  0);
};

const getAdditionalTotal = () => {
  return 0;
};

const getTotal = (timeslipTotal, additionalTotal, modifiers) => {
  return modifiers.reduce((runningTotal, modifier) =>
    runningTotal + ((runningTotal / 100) * modifier.get('percent')),
  timeslipTotal + additionalTotal);
};

class Invoice extends React.Component {
  componentDidMount() {
    this.fetchInvoice().then(() => {
      this.fetchData();
    });
  }

  fetchInvoice() {
    return this.props.fetchInvoice(this.props.invoiceId);
  }

  fetchData() {
    const project = this.props.invoice.get('project');
    let promises = [this.props.fetchInvoiceTimeslips(this.props.invoiceId)];
    // if (this.props.invoice.get('issued_at') === null) {
    //   this.props.fetchProjectTimeslips(project);
    // }
    return Promise.all(promises);
  }

  render() {
    if (!this.props.project) {
      return (<strong>Loading...</strong>);
    }
    const invoice = this.props.invoice;
    const project = this.props.project;

    const timeslipTotal = getTimeslipTotal(project.get('hourly_rate'), this.props.timeslips);
    const additionalTotal = getAdditionalTotal();
    const total = getTotal(timeslipTotal, additionalTotal, project.get('invoice_modifier'));

    return (
      <div className='row'>
        <div className='col-md-4'>
          <InvoiceInfo
            project={project}
            invoice={invoice}
            timeslipTotal={timeslipTotal}
            additionalTotal={additionalTotal}
            total={total}
            onDelete={() =>
              this.props.deleteInvoice(invoice.get('id'))
            }
            onMarkAsIssued={() =>
              this.props.markAsIssued(
                invoice.get('id'),
                project.get('id'),
                this.props.timeslips
              )
            }
            onMarkAsPaid={() => {
              this.props.markAsPaid(
                invoice.get('id'),
                project.get('id'),
                total
              )
            }}
          />
        </div>
        <div className='col-md-8'>
          <InvoiceTimeslips
            project={this.props.project}
            timeslips={this.props.timeslips}
            items={this.props.invoiceItems}
            onAddItem={(name, price) =>
              this.props.addItem(invoice.get('id'), name, price)
            }
          />
        </div>
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
    invoiceItems: [],
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
