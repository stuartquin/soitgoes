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
import {fetchTasks} from 'modules/task';
import {fetchTimeslips} from 'modules/timeslip';

const getInvoiceTotals = (invoice) => {
  const {project, timeslips, modifiers, tasks} = invoice;
  const totalHours = timeslips.reduce((prev, {hours}) => prev + hours, 0);
  const totalTask = tasks.reduce((prev, {cost}) => prev + cost, 0);
  const subTotal = totalTask + (totalHours * project.hourly_rate);
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
    const {invoiceId, projectId} = this.props;
    const promises = invoiceId ? [
      this.props.fetchInvoice(invoiceId),
      this.props.fetchTimeslips(invoiceId),
      this.props.fetchTasks(projectId, invoiceId),
      this.props.fetchModifiers(),
    ] : [
      this.props.fetchTimeslips('none', null, null, projectId),
      this.props.fetchTasks(projectId, 'none'),
      this.props.fetchModifiers(),
    ];

    Promise.all(promises).then(() => {
      const editableInvoice = getInvoiceTotals({
        ...this.props.invoice,
        timeslips: [...this.props.timeslips],
        modifiers: [...this.props.modifiers],
        tasks: [...this.props.tasks],
      });

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
    const {editableInvoice} = this.state;
    const modifiers = editableInvoice.modifiers.filter(m => (
      m.id !== modifier.id
    ));

    this.setState({
      editableInvoice: getInvoiceTotals({...editableInvoice, modifiers})
    });
  }

  handleUpdateStatus(status) {
    const {editableInvoice} = this.state;
    this.props.saveInvoice({...editableInvoice, status});
  }

  render() {
    const {editableInvoice} = this.state;
    if (!editableInvoice) {
      return (<Loading />);
    }
    const isEditable = !Boolean(editableInvoice.issued_at);
    const dueDate = this.state.dueDate || editableInvoice.due_date;

    return (
      <React.Fragment>
        <NavMenu />

        <Container>
          <Grid>
            <Cell sm="12">
              <InvoiceHeader invoice={editableInvoice}/>
            </Cell>
          </Grid>

          <Styled>
            <Settings
              invoice={editableInvoice}
              isEditable={isEditable}
              dueDate={dueDate}
              onRemoveModifier={this.handleRemoveModifier}
              onSetDueDate={(date) => this.setDueDate(date)}
              onSetReference={(reference) => this.setReference(reference)}
              onUpdateStatus={this.handleUpdateStatus}
            />
            <Generator
              invoice={editableInvoice}
              isEditable={isEditable}
              onDeleteInvoiceTimeslip={(id) => console.log(id)}
              onDeleteInvoiceTask={(id) => console.log(id)}
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
  const projectId = parseInt(params.projectId, 10);
  let invoiceId = null;
  let invoice = null;

  if (params.invoiceId) {
    const invoices = selectJoined(state.invoice.items, state);
    invoiceId = parseInt(params.invoiceId, 10);
    invoice = invoices[invoiceId] || {};
  } else {
    invoice = {
      project: projects[projectId] || {}
    };
  }

  return {
    invoiceId,
    projectId,
    invoice,
    modifiers: Object.values(state.modifier.items, state.modifier.results),
    timeslips: selectResults(state.timeslip.items, state.timeslip.results),
    tasks: selectResults(state.task.items, state.task.results),
  };
};

export default connect(mapStateToProps, {
  saveInvoice,
  deleteInvoice,
  fetchInvoice,
  fetchModifiers,
  fetchTasks,
  fetchTimeslips,
})(Invoice);
