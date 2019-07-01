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
import {groupByTimeslip, groupByTask} from 'services/invoice';

import {fetchInvoice, deleteInvoice, saveInvoice} from 'modules/invoice';
import {fetchModifiers} from 'modules/modifier';
import {fetchTasks} from 'modules/task';
import {fetchTimeslips} from 'modules/timeslip';

const getInvoiceTotals = (invoice, items, modifiers) => {
  const {project} = invoice;
  const [totalHours, subTotal] = items.reduce(([h, s], {hours, subTotal}) => (
    [h + hours, s + subTotal]
  ), [0, 0]);
  const total = modifiers.reduce((prev, mod) => (
    prev + getModifierImpact(mod, subTotal)
  ), subTotal);

  console.log('TOTALS', totalHours, subTotal, total);

  return {
    ...invoice,
    subtotal_due: subTotal,
    total_due: total,
    totalHours,
    modifiers,
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
      displaySettings: {
        groupBy: 'time',
        showHours: true,
      }
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
      invoice, items, modifiers
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

  handleSetDisplaySettings = (displaySettings) => {
    this.setState({ displaySettings });
  }

  render() {
    const {invoice} = this.props;
    const {project} = invoice;
    const {
      editable, tasks, timeslips, modifiers, displaySettings
    } = this.state;
    if (!invoice) {
      return (<Loading />);
    }

    const items = displaySettings.groupBy === 'time' ?
      groupByTimeslip(timeslips, project.hourly_rate) :
      groupByTask(tasks, timeslips, project.hourly_rate, displaySettings.showHours);

    return (
      <React.Fragment>
        <NavMenu />

        <Container>
          <Grid>
            <Cell sm="12">
              <InvoiceHeader
                invoice={invoice}
                onUpdateStatus={this.handleUpdateStatus}
              />
            </Cell>
          </Grid>

          <Styled>
            <Generator
              invoice={invoice}
              items={items}
              displaySettings={displaySettings}
              onSetDisplaySettings={this.handleSetDisplaySettings}
              onRemove={({ itemType, id }) => this.handleRemove(itemType, id)}
            />
            <Settings
              invoice={
                getInvoiceTotals(invoice, items, modifiers)
              }
              modifiers={modifiers}
              reference={editable.reference}
              dueDate={editable.due_date}
              onRemoveModifier={(id) => this.handleRemove('modifiers', id)}
              onSetReference={(reference) => this.setReference(reference)}
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
  let modifiers = Object.values(state.modifier.items);
  let invoice = {
    project: projects[projectId] || {},
    due_date: moment().add(14, 'days').format('YYYY-MM-DD'),
  };

  if (invoiceId && state.invoice.items[invoiceId]) {
    invoice = getWithJoined(
      state.invoice.items[invoiceId] || {}, {project: projects}
    );
    modifiers = modifiers.filter(({id}) => invoice.modifier.includes(id));
  }


  return {
    invoiceId,
    projectId,
    invoice,
    modifiers,
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
