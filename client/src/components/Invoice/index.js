import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import {connect} from 'react-redux';

import NavMenu from 'components/nav/navmenu';
import {BREAKPOINTS, Container, Grid, Cell} from 'components/Grid';
import {Loading} from '../loading';
import InvoiceHeader from 'components/Invoice/InvoiceHeader';
import Generator from 'components/Invoice/Generator';
import Settings from 'components/Invoice/Settings';

import {getWithJoined, selectJoined, selectResults} from 'services/selectors';
import {getModifierImpact} from 'services/modifier';

import {fetchInvoice, deleteInvoice, saveInvoice} from 'modules/invoice';
import {fetchModifiers} from 'modules/modifier';
import {fetchTasks} from 'modules/task';
import {fetchTimeslips} from 'modules/timeslip';

const getInvoiceTotals = (invoice, timeslips, modifiers, tasks) => {
  const {project} = invoice;
  const totalHours = timeslips.reduce((prev, {hours}) => prev + hours, 0);
  const totalTask = tasks.reduce((prev, {cost}) => prev + cost, 0);
  const totalTime = (totalHours * project.hourly_rate);
  const subTotal = totalTask + totalTime;
  const total = modifiers.reduce((prev, mod) => (
    prev + getModifierImpact(mod, subTotal)
  ), subTotal);

  return {
    ...invoice,
    subtotal_due: subTotal,
    total_due: total,
    totalTask,
    totalTime,
    totalHours,
    timeslips,
    modifiers,
    tasks,
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

  @media(max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column-reverse;
  }
`;

class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: {},
      dueDate: null,
      reference: '',
      confirmDelete: false,
      tasks: [],
      modifiers: [],
      timeslips: [],
    };

    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
  }

  componentDidMount() {
    this.fetchData().then(() => {
      const {invoice, timeslips, modifiers, tasks} = this.props;
      this.setState({
        editable: {
          due_date: invoice.due_date,
          reference: invoice.reference,
        },
        timeslips,
        tasks,
        modifiers,
      });
    });
  }

  fetchData() {
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

    return Promise.all(promises);
  }

  handleRemove(field, id) {
    const items = this.state[field].filter(t => t.id !== id);
    this.setState({
      [field]: items
    });
  }

  handleChange({target}) {
    this.setState({
      editable: {
        ...this.state.editable,
        [target.name]: target.value,
      }
    });
  }

  handleUpdateStatus(status) {
    const {invoice} = this.props;
    const {editable, timeslips, tasks, modifiers} = this.state;
    const {project} = invoice;
    const totalInvoice = getInvoiceTotals(
      invoice, timeslips, modifiers, tasks
    );
    const saveInvoice = {
      ...totalInvoice,
      ...editable,
      project: project.id,
      status,
    };

    this.props.saveInvoice(saveInvoice).then(({id}) => {
      const {history} = this.props;
      history.push(`/project/${project.id}/invoice/${id}`);
    });
  }

  render() {
    const {invoice} = this.props;
    const {editable, tasks, timeslips, modifiers} = this.state;
    if (!invoice) {
      return (<Loading />);
    }

    return (
      <React.Fragment>
        <NavMenu />

        <Container>
          <Grid>
            <Cell sm="12">
              <InvoiceHeader invoice={invoice}/>
            </Cell>
          </Grid>

          <Styled>
            <Generator
              invoice={invoice}
              tasks={tasks}
              onRemoveTimeslip={(id) => this.handleRemove('timeslips', id)}
              onRemoveTask={(id) => this.handleRemove('tasks', id)}
              timeslips={timeslips}
            />
            <Settings
              invoice={
                getInvoiceTotals(invoice, timeslips, modifiers, tasks)
              }
              modifiers={modifiers}
              reference={editable.reference}
              dueDate={editable.due_date}
              onRemoveModifier={(id) => this.handleRemove('modifiers', id)}
              onSetReference={(reference) => this.setReference(reference)}
              onUpdateStatus={this.handleUpdateStatus}
              onChange={this.handleChange}
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
  const invoiceId = parseInt(params.invoiceId, 10);
  let invoice = {
    project: projects[projectId] || {},
    due_date: moment().add(14, 'days').format('YYYY-MM-DD'),
  };

  if (invoiceId && state.invoice.items[invoiceId]) {
    invoice = getWithJoined(
      state.invoice.items[invoiceId] || {}, {project: projects}
    );
  }

  return {
    invoiceId,
    projectId,
    invoice,
    modifiers: Object.values(state.modifier.items),
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
