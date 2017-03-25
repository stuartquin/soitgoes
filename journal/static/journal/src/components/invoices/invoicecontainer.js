'use strict';
import React from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';

import {Generator} from './generator';
import {Settings} from './settings';
import {InvoiceHeader} from './invoiceheader';
import {Loading} from '../loading';
import {Confirm} from '../confirm';

import {fetchModifiers} from 'modules/modifier';
import {
  fetchInvoice, deleteInvoice, markAsPaid, markAsIssued, deleteInvoiceTask,
  deleteInvoiceModifier, deleteInvoiceTimeslip, addInvoiceModifier,
  fetchInvoiceTasks, fetchInvoiceTimeslips
} from 'modules/invoice';


class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dueDate: null,
      confirmDelete: false
    };
  }

  componentDidMount() {
    this.props.fetchModifiers();
    if (this.props.id !== 'add') {
      this.fetchInvoice().then(() => this.fetchData(this.props.id))
    }
  }

  fetchInvoice() {
    return this.props.fetchInvoice(this.props.id);
  }

  fetchData(id) {
    let promises = [
      this.props.fetchInvoiceTimeslips(id),
      this.props.fetchInvoiceTasks(id)
    ];
    return Promise.all(promises);
  }

  setDueDate(dueDate) {
    this.setState({dueDate});
  }

  render() {
    const invoice = this.props.invoice;
    if (invoice.isEmpty()) {
      return (<Loading />);
    }

    const modifiers = this.props.modifiers;
    const project = this.props.project;
    const contact = this.props.contact;
    const isEditable = !Boolean(invoice.get('issued_at'));
    const dueDate = this.state.dueDate || invoice.get('due_date');

    return (
      <div className='invoice-container'>
        <Confirm
          title='Confirm Delete'
          open={this.state.confirmDelete}
          onConfirm={() => this.props.deleteInvoice(invoice.get('id'))}
          onCancel={() => this.setState({confirmDelete: false})}>
          Are you sure you want to delete?
        </Confirm>

        <div className='header'>
          <InvoiceHeader
            invoice={invoice}
            project={project}
            contact={contact}
            onDelete={() => this.setState({confirmDelete: true})}
            onMarkAsIssued={() =>
              this.props.markAsIssued(
                invoice.get('id'),
                project.get('id'),
                dueDate,
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
        <div className='content'>
          <Settings
            invoice={invoice}
            project={project}
            timeslips={this.props.timeslips}
            tasks={this.props.tasks}
            modifiers={modifiers}
            isEditable={isEditable}
            dueDate={dueDate}
            onAddModifier={(modifier) =>
              this.props.addInvoiceModifier(
                invoice.get('id'),
                modifier.get('id')
              )
            }
            onRemoveModifier={(modifier) =>
              this.props.deleteInvoiceModifier(
                invoice.get('id'),
                modifier.get('id')
              )
            }
            onSetDueDate={(date) => this.setDueDate(date)}
          />
          <Generator
            invoice={invoice}
            project={project}
            timeslips={this.props.timeslips}
            tasks={this.props.tasks}
            modifiers={modifiers}
            isEditable={isEditable}
            onDeleteInvoiceTimeslip={(id) =>
              this.props.deleteInvoiceTimeslip(invoice.get('id'), id)
            }
            onDeleteInvoiceTask={(id) =>
              this.props.deleteInvoiceTask(invoice.get('id'), id)
            }
          />
        </div>
      </div>
    );
  }
}

const getInvoiceTimeslips = (invoice, timeslips) => {
  return timeslips.filter((t) => t.get('invoice') === invoice.get('id'));
}

const getInvoiceTasks = (invoice, tasks) => {
  return tasks.filter((t) => t.get('invoice') === invoice.get('id'));
}

const mapStateToProps = (state, { params }) => {
  const id = parseInt(params.id, 10);
  const invoice = state.invoices.items.get(id, Immutable.Map());
  const project = state.projects.items.get(invoice.get('project'), Immutable.Map());
  const contact = state.contacts.items.get(project.get('contact'), Immutable.Map());

  return {
    id,
    invoice,
    project,
    contact,
    modifiers: state.modifiers.items,
    timeslips: getInvoiceTimeslips(invoice, state.timeslips.items),
    tasks: getInvoiceTasks(invoice, state.tasks.items)
  };
};

const actions = {
  fetchInvoice, deleteInvoice, markAsPaid, markAsIssued, deleteInvoiceTask,
  deleteInvoiceModifier, deleteInvoiceTimeslip, addInvoiceModifier,
  fetchInvoiceTasks, fetchInvoiceTimeslips,
  fetchModifiers
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
