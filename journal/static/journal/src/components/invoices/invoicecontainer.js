'use strict';
import React from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';

import {Generator} from './generator';
import {Settings} from './settings';
import {InvoiceHeader} from './invoiceheader';
import {Loading} from '../loading';
import {Confirm} from '../confirm';

import * as invoiceActions from '../../actions/invoices';


class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dueDate: null,
      confirmDelete: false
    };
  }

  componentDidMount() {
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
    if (this.props.isLoading) {
      return (<Loading />);
    }
    const invoice = this.props.invoice;
    const modifiers = invoice.get('modifier');
    const project = this.props.project || Immutable.Map();
    const isEditable = !Boolean(invoice.get('issued_at'));
    const dueDate = this.state.dueDate || invoice.get('due_date');

    return (
      <div className='invoice-container'>
        <Confirm
          title='Confirm Delete'
          message='Are you sure you want to delete?'
          open={this.state.confirmDelete}
          onConfirm={() => this.props.deleteInvoice(invoice.get('id'))}
          onCancel={() => this.setState({confirmDelete: false})}
        />
        <div className='header'>
          <InvoiceHeader
            invoice={invoice}
            project={project}
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

const getInvoiceProject = (invoice, projects)  => {
  const projectId = invoice.get('project').get('id');
  return projects.find((x) => x.get('id') === projectId);
};

const getInvoiceTimeslips = (invoice, timeslips) => {
  return timeslips.filter((t) => t.get('invoice') === invoice.get('id'));
}

const getInvoiceTasks = (invoice, tasks) => {
  return tasks.filter((t) => t.get('invoice') === invoice.get('id'));
}

const mapStateToProps = (state, { params }) => {
  const id = parseInt(params.id, 10);
  const invoice = state.invoices.items.get(id);

  let mapState = {
    id,
    isLoading: true
  }

  if (!invoice) {
    return mapState;
  }

  mapState.isLoading = false;
  mapState.invoice = invoice;
  mapState.project = getInvoiceProject(invoice, state.projects.items);
  mapState.timeslips = getInvoiceTimeslips(invoice, state.timeslips.items);
  mapState.tasks = getInvoiceTasks(invoice, state.tasks.items);
  return mapState;
};

const actions = {
  ...invoiceActions
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
