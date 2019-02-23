'use strict';
import React from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';

import NavMenu from 'components/nav/navmenu';
import {Grid, Cell} from 'components/Grid';
import {Generator} from './generator';
import {Settings} from './settings';
import {Loading} from '../loading';
import {Confirm} from '../confirm';
import InvoiceHeader from './invoiceheader';
import {selectJoined, selectResults} from 'services/selectors';

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
      reference: '',
      confirmDelete: false
    };
  }

  componentDidMount() {
    this.props.fetchModifiers();
    const {projectId, invoiceId, fetchInvoice, fetchTimeslips} = this.props;
    const promises = invoiceId ? [
      fetchInvoice(),
      fetchTimeslips(invoiceId),
    ] : [
      fetchTimeslips('none', null, null, projectId),
    ];

    Promise.all(promises);
  }

  setDueDate(dueDate) {
    this.setState({dueDate});
  }

  setReference(reference) {
    this.setState({reference});
  }

  handleMarkIssued() {
    const {timeslips, invoice} = this.props;
    this.props.updateInvoice(invoice.id, {
      reference: this.state.reference,
      due_date: this.state.dueDate || invoice.due_date,
      timeslips: timeslips.map(t => t.id),
      status: 'ISSUED'
    });
  }

  handleMarkPaid() {
    const invoice = this.props.invoice;
    this.props.updateInvoice(invoice.id, {
      total_paid: invoice.total_due,
      status: 'PAID'
    });
  }

  render() {
    const {invoice, project} = this.props;
    if (!invoice) {
      return (<Loading />);
    }
    const modifiers = this.props.modifiers;
    const isEditable = !Boolean(invoice.issued_at);
    const dueDate = this.state.dueDate || invoice.due_date;

    return (
      <React.Fragment>
        <NavMenu />

        <div className='header'>
          <InvoiceHeader
            invoice={invoice}
            project={project}
            onDelete={() => this.setState({confirmDelete: true})}
            onMarkAsIssued={() => this.handleMarkIssued()}
            onMarkAsPaid={() => this.handleMarkPaid()}
          />
        </div>
        <Grid>
          <Cell sm="4">
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
                  invoice.id,
                  modifier.id
                )
              }
              onRemoveModifier={(modifier) =>
                this.props.deleteInvoiceModifier(
                  invoice.id,
                  modifier.id
                )
              }
              onSetDueDate={(date) => this.setDueDate(date)}
              onSetReference={(reference) => this.setReference(reference)}
            />
          </Cell>
          <Cell sm="8">
            <Generator
              invoice={invoice}
              project={project}
              timeslips={this.props.timeslips}
              tasks={this.props.tasks}
              isEditable={isEditable}
              onDeleteInvoiceTimeslip={(id) =>
                this.props.updateTimeslip(id, {invoice: null})
              }
              onDeleteInvoiceTask={(id) =>
                this.props.updateTask(id, {invoice: null})
              }
            />
          </Cell>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  const projects = selectJoined(state.project.items, state);
  const params = match.params;
  let invoice = null;
  let project = null;
  let invoiceId = null;
  let projectId = null;

  if (params.invoiceId) {
    invoiceId = parseInt(paramse.invoiceId, 10);
    invoice = state.invoice.items[invoiceId] || {};
    project = projects[invoice.project] || {}
    projectId = project.id;
  } else {
    projectId = parseInt(params.projectId, 10);
    project = projects[projectId] || {}
    invoice = {};
  }

  return {
    invoiceId,
    projectId,
    invoice,
    project,
    modifiers: [],
    timeslips: [],
    tasks: [],
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
