'use strict';
import React from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';

import {Generator} from './generator';
import {Settings} from './settings';
import {InvoiceHeader} from './invoiceheader';
import {Loading} from '../loading';
import {Confirm} from '../confirm';

import {
  fetchInvoice, deleteInvoice, deleteInvoiceModifier, addInvoiceModifier,
  updateInvoice
} from 'modules/invoice';
import {fetchModifiers} from 'modules/modifier';
import { fetchTasks, updateTask } from 'modules/task';
import { fetchTimeslips, updateTimeslip } from 'modules/timeslip';

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
      this.props.fetchTimeslips(id),
      this.props.fetchTasks(null, null, id)
    ];
    return Promise.all(promises);
  }

  setDueDate(dueDate) {
    this.setState({dueDate});
  }

  handleMarkIssued() {
    const invoice = this.props.invoice;
    this.props.updateInvoice(invoice.get('id'), {
      due_date: this.state.dueDate || invoice.get('due_date'),
      timeslips: this.props.timeslips.map(t => t.get('id')).toJS(),
      status: 'ISSUED'
    });
  }

  handleMarkPaid() {
    const invoice = this.props.invoice;
    this.props.updateInvoice(invoice.get('id'), {
      total_paid: invoice.get('total_due'),
      status: 'PAID'
    });
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
            onMarkAsIssued={() => this.handleMarkIssued()}
            onMarkAsPaid={() => this.handleMarkPaid()}
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
              this.props.updateTimeslip(id, {invoice: null})
            }
            onDeleteInvoiceTask={(id) =>
              this.props.updateTask(id, {invoice: null})
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

const mapStateToProps = (state, { match }) => {
  const params = match.params;
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
  fetchInvoice,
  updateInvoice,
  deleteInvoice,

  fetchModifiers,
  deleteInvoiceModifier,
  addInvoiceModifier,

  fetchTasks,
  updateTask,

  fetchTimeslips,
  updateTimeslip
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
