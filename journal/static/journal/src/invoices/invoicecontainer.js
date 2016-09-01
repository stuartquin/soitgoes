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

const getAdditionalTotal = (items) => {
  return items.reduce((prev, current) =>
    prev + current.get('cost_per_unit'),
  0);
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
    let promises = [
      this.props.fetchInvoiceTimeslips(this.props.invoiceId),
      this.props.fetchInvoiceItems(this.props.invoiceId)
    ];
    return Promise.all(promises);
  }

  render() {
    const invoice = this.props.invoice;
    if (this.props.projects.isEmpty() || invoice.isEmpty()) {
      return (<strong>Loading...</strong>);
    }
    const project = this.props.projects.find(proj =>
      proj.get('id') === invoice.get('project').get('id')
    );

    const timeslipTotal = getTimeslipTotal(project.get('hourly_rate'), this.props.timeslips);
    const additionalTotal = getAdditionalTotal(this.props.invoiceItems);
    const total = getTotal(timeslipTotal, additionalTotal, invoice.get('modifier'));

    const isIssued = !!invoice.get('issued_at');

    return (
      <div className='row'>
        <div className='col-md-4'>
          <InvoiceInfo
            isIssued={isIssued}
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
            isIssued={isIssued}
            project={project}
            timeslips={this.props.timeslips}
            items={this.props.invoiceItems}
            onAddItem={(name, price) =>
              this.props.createItem(invoice.get('id'), name, price)
            }
            onDeleteInvoiceTimeslip={(timeslipId) =>
              this.props.deleteInvoiceTimeslip(invoice.get('id'), timeslipId)
            }
            onDeleteInvoiceItem={(itemId) =>
              this.props.deleteInvoiceItem(invoice.get('id'), itemId)
            }
          />
        </div>
      </div>
    );
  }
}

const getInvoiceProject = (projects, invoice) => {
  return projects.find((x) => x.get('id') === invoice.get('project').get('id'));
};

const mapStateToProps = ({ invoices }, { params }) => {
  return {
    invoice: invoices.invoice,
    invoiceItems: invoices.invoiceItems,
    timeslips: invoices.timeslips,
    projects: invoices.projects,
    invoiceId: params.id
  };
};

const actions = {
  ...projectActions,
  ...invoiceActions
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
