import React from 'react';
import styled from 'styled-components';

import {connect} from 'react-redux';
import Immutable from 'immutable';

import NavMenu from 'components/nav/navmenu';
import {Container, Grid, Cell} from 'components/Grid';
import {Loading} from '../loading';
import InvoiceHeader from 'components/Invoice/InvoiceHeader';
import Generator from 'components/Invoice/Generator';
import Settings from 'components/Invoice/Settings';

import {selectJoined, selectResults} from 'services/selectors';
import {getModifierImpact} from 'services/modifier';

import {fetchInvoice, deleteInvoice, saveInvoice} from 'modules/invoice';
import {fetchModifiers} from 'modules/modifier';
import { fetchTasks, updateTask } from 'modules/task';
import { fetchTimeslips, updateTimeslip } from 'modules/timeslip';

const getInvoiceTotals = (invoice, project) => {
  const {timeslips, modifiers} = invoice;
  const totalHours = timeslips.reduce((prev, {hours}) =>prev + hours, 0);
  const subTotal = totalHours * project.hourly_rate;
  const total = modifiers.reduce((prev, mod) => (
    prev + getModifierImpact(mod, subTotal)
  ), subTotal);

  return {
    ...invoice,
    subtotal_due: subTotal,
    total_due: total,
  };
};

const Styled = styled.div`
  background: #f5f3f5;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  height: 100%;
  max-width: 1200px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;
`;

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
    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
  }

  componentDidMount() {
    const {
      project, invoiceId, fetchModifiers, fetchInvoice, fetchTimeslips
    } = this.props;
    const promises = invoiceId ? [
      fetchInvoice(invoiceId),
      fetchTimeslips(invoiceId),
      fetchModifiers(),
    ] : [
      fetchTimeslips('none', null, null, project.id),
      fetchModifiers(),
    ];

    Promise.all(promises).then(() => {
      const editableInvoice = getInvoiceTotals({
        ...this.props.invoice || {},
        timeslips: [...this.props.timeslips],
        modifiers: [...this.props.modifiers],
        project: project.id,
      }, project);

      this.setState({editableInvoice});
    });
  }

  setDueDate(dueDate) {
    this.setState({dueDate});
  }

  setReference(reference) {
    this.setState({reference});
  }

  handleRemoveModifier(modifier) {
    const {project} = this.props;
    const {editableInvoice} = this.state;
    const modifiers = editableInvoice.modifiers.filter(m => (
      m.id !== modifier.id
    ));

    this.setState({
      editableInvoice: getInvoiceTotals({...editableInvoice, modifiers}, project)
    });
  }

  handleUpdateStatus(status) {
    const {editableInvoice} = this.state;
    this.props.saveInvoice({...editableInvoice, status});
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
                invoice={editableInvoice}
                project={project}
              />
            </Cell>
          </Grid>

          <Styled>
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
              onUpdateStatus={this.handleUpdateStatus}
            />
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
          </Styled>
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
    invoiceId = parseInt(params.invoiceId, 10);
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
  saveInvoice,
  deleteInvoice,

  fetchModifiers,

  fetchTasks,
  updateTask,

  fetchTimeslips,
  updateTimeslip
};

export default connect(mapStateToProps, actions)(Invoice);
