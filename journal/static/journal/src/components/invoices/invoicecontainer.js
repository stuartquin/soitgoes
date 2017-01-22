'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { InvoiceInfo } from './invoiceinfo';
import { InvoiceTimeslips } from './invoicetimeslips';
import { InvoiceAdvanced } from './invoiceadvanced';
import * as invoiceActions from '../../actions/invoices';

import styles from './styles.css';

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
      this.props.fetchInvoiceItems(this.props.invoiceId),
      this.props.fetchInvoiceTasks(this.props.invoiceId)
    ];
    return Promise.all(promises);
  }

  render() {
    const invoice = this.props.invoice;
    if (this.props.projects.isEmpty() || this.props.isLoading) {
      return (<strong>Loading...</strong>);
    }

    const project = this.props.projects.get(`${invoice.get('project')}`)
    const isIssued = !!invoice.get('issued_at');

    return (
      <div className='row'>
        <div className='col-md-4'>
          <InvoiceInfo
            isIssued={isIssued}
            project={project}
            invoice={invoice}
            timeslips={this.props.timeslips}
            tasks={this.props.tasks}
            modifiers={this.props.modifiers}
            invoiceItems={this.props.invoiceItems}
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
                invoice.get('total_due')
              )
            }}
          />
        </div>
        <div className='col-md-8'>
          <InvoiceAdvanced
            isIssued={isIssued}
            project={project}
            invoice={invoice}
            onUpdate={(updates) =>
              this.props.updateInvoice(
                invoice.get('id'),
                project.get('id'),
                updates
              )
            }
          />
          <InvoiceTimeslips
            isIssued={isIssued}
            project={project}
            timeslips={this.props.timeslips}
            items={this.props.invoiceItems}
            tasks={this.props.tasks}
            onAddItem={(name, price, qty) =>
              this.props.createItem(invoice.get('id'), name, price, qty)
            }
            onDeleteInvoiceTimeslip={(timeslipId) =>
              this.props.deleteInvoiceTimeslip(invoice.get('id'), timeslipId)
            }
            onDeleteInvoiceItem={(itemId) =>
              this.props.deleteInvoiceItem(invoice.get('id'), itemId)
            }
            onDeleteTask={(taskId) =>
              this.props.deleteInvoiceTask(invoice.get('id'), taskId)
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

const getInvoiceTimeslips = (invoice, timeslips) => {
  const invoiceId = invoice.get('id');
  return timeslips.filter((t) => t.get('invoice') === invoiceId);
}

const mapStateToProps = (state, { params }) => {
  const invoice = state.invoice;
  const invoiceId = parseInt(params.id, 10);
  const tasks = state.tasks.items.filter((task) =>
    task.get('invoice') === invoiceId
  );
  return {
    isLoading: invoice.view.get('isLoading'),
    invoice: invoice.details,
    invoiceItems: invoice.additionalItems,
    timeslips: getInvoiceTimeslips(invoice.details, state.timeslips.items),
    projects: state.projects.items,
    tasks: tasks,
    invoiceId: params.id,
    modifiers: invoice.modifiers
  };
};

const actions = {
  ...invoiceActions
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
