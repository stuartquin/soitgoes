import React from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';

import NavMenu from 'components/nav/navmenu';
import {Container, Grid, Cell} from 'components/Grid';
import {Generator} from './generator';
import {Loading} from '../loading';
import {Confirm} from '../confirm';
import InvoiceHeader from './invoiceheader';
import {selectJoined, selectResults} from 'services/selectors';
import Settings from './settings';

import {
  fetchInvoice, deleteInvoice, updateInvoice
} from 'modules/invoice';
import {fetchModifiers} from 'modules/modifier';
import { fetchTasks, updateTask } from 'modules/task';
import { fetchTimeslips, updateTimeslip } from 'modules/timeslip';

class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editableInvoice: null,
      dueDate: null,
      reference: '',
      confirmDelete: false
    };

    this.handleRemoveModifier = this.handleRemoveModifier.bind(this);
  }

  componentDidMount() {
    const {projectId, invoiceId, fetchInvoice, fetchTimeslips} = this.props;
    const promises = invoiceId ? [
      fetchInvoice(),
      fetchTimeslips(invoiceId),
      this.props.fetchModifiers(),
    ] : [
      fetchTimeslips('none', null, null, projectId),
      this.props.fetchModifiers(),
    ];

    Promise.all(promises).then(() => {
      const editableInvoice = {
        ...this.props.invoice,
        timeslips: [...this.props.timeslips],
        modifiers: [...this.props.modifiers],
      };

      this.setState({editableInvoice});
    });
  }

  componentDidUpdate(prevProps) {
    const {invoiceId, invoice} = this.props;
  }

  setDueDate(dueDate) {
    this.setState({dueDate});
  }

  setReference(reference) {
    this.setState({reference});
  }

  handleRemoveModifier(modifier) {
    const {editableInvoice} = this.state;
    const modifiers = editableInvoice.modifiers.filter(m => (
      m.id !== modifier.id
    ));

    this.setState({
      editableInvoice: {
        ...editableInvoice,
        modifiers
      }
    });
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
    const {project} = this.props;
    const {editableInvoice} = this.state;
    if (!editableInvoice) {
      return (<Loading />);
    }
    const {modifiers} = editableInvoice;
    const isEditable = !Boolean(editableInvoice.issued_at);
    const dueDate = this.state.dueDate || editableInvoice.due_date;

    return (
      <React.Fragment>
        <NavMenu />

        <Container>
          <Grid>
            <Cell sm="12">
              <InvoiceHeader
                editableInvoice={editableInvoice}
                project={project}
                onDelete={() => this.setState({confirmDelete: true})}
                onMarkAsIssued={() => this.handleMarkIssued()}
                onMarkAsPaid={() => this.handleMarkPaid()}
              />
            </Cell>
            <Cell sm="9">
              <Generator
                invoice={editableInvoice}
                project={project}
                timeslips={this.props.timeslips}
                tasks={this.props.tasks}
                isEditable={isEditable}
                onDeleteInvoiceTimeslip={(id) =>
                  this.props.updateTimeslip(id, {editableInvoice: null})
                }
                onDeleteInvoiceTask={(id) =>
                  this.props.updateTask(id, {editableInvoice: null})
                }
              />
            </Cell>
            <Cell sm="3">
              <Settings
                invoice={editableInvoice}
                project={project}
                timeslips={this.props.timeslips}
                tasks={this.props.tasks}
                modifiers={modifiers}
                isEditable={isEditable}
                dueDate={dueDate}
                onRemoveModifier={this.handleRemoveModifier}
                onSetDueDate={(date) => this.setDueDate(date)}
                onSetReference={(reference) => this.setReference(reference)}
              />
            </Cell>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  const projects = selectJoined(state.project.items, state);
  const params = match.params;
  let project = null;
  let invoiceId = null;
  let invoice = null;
  let projectId = null;

  if (params.invoiceId) {
    invoiceId = parseInt(paramse.invoiceId, 10);
    invoice = state.invoice.items[invoiceId] || {};
    project = projects[invoice.project] || {}
    projectId = project.id;
  } else {
    projectId = parseInt(params.projectId, 10);
    project = projects[projectId] || {}
  }

  return {
    invoiceId,
    invoice,
    projectId,
    project,
    modifiers: Object.values(state.modifier.items, state.modifier.results),
    timeslips: selectResults(state.timeslip.items, state.timeslip.results),
    tasks: [],
  };
};

const actions = {
  fetchInvoice,
  updateInvoice,
  deleteInvoice,

  fetchModifiers,

  fetchTasks,
  updateTask,

  fetchTimeslips,
  updateTimeslip
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};
