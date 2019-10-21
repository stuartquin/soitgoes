import React from 'react';
import styled from 'styled-components';
import { Flex } from 'rebass/styled-components';
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
import {getDisplayItems, getNewInvoice} from 'services/invoice';

import {fetchInvoice, deleteInvoice, saveInvoice} from 'modules/invoice';
import {fetchTasks} from 'services/task';
import {fetchTimeslips} from 'services/timeslip';
import {fetchModifiers} from 'services/modifier';

const getInvoiceTotals = (invoice, items, modifiers) => {
  const modifier = invoice.modifier.map(id => modifiers.find(m => id === m.id));
  const [totalHours, subTotal] = items.filter(
    ({ isActive }) => isActive
  ).reduce(([h, s], {hours, subTotal}) => (
    [h + hours, s + subTotal]
  ), [0, 0]);
  const total = modifier.reduce((prev, mod) => (
    prev + getModifierImpact(mod, subTotal)
  ), subTotal);

  return {
    ...invoice,
    subtotal_due: invoice.subtotal_due || subTotal,
    total_due: invoice.total_due || total,
    totalHours,
  };
};

const Styled = styled(Flex)`
  background: #f5f3f5;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0,0%,40%,.2);
  height: 100%;
  max-width: 1200px;
  width: 100%;

  @media(max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column-reverse;
  }
`;

class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modifiers: [],
      timeslips: [],
      editable: null,
      dueDate: null,
      reference: '',
      confirmDelete: false,
      displaySettings: {
        groupBy: 'time',
        showHours: true,
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
  }

  componentDidMount() {
    const {invoiceId, project} = this.props;
    this.fetchData().then(([invoice, modifier, timeslips, tasks]) => {
      const editable = invoice.id ?
        {...invoice, modifier: invoice.modifier || []} :
        {...invoice, modifier: modifier.results.map(m => m.id)};

      this.setState({
        editable,
        modifiers: modifier.results,
        timeslips: timeslips.results,
        tasks: tasks.results
      });
    });
  }

  fetchData() {
    const {invoiceId, project} = this.props;
    const promises = invoiceId ? [
      this.props.fetchInvoice(invoiceId, { project: project.id }),
      fetchModifiers(),
      fetchTimeslips({invoice: invoiceId, project: project.id}),
      fetchTasks({project: project.id}),
    ] : [
      this.props.fetchInvoice('new', { project: project.id }),
      fetchModifiers(),
      fetchTimeslips({invoice: 'none', project: project.id}),
      fetchTasks({project: project.id}),
    ];

    return Promise.all(promises);
  }

  handleToggleItem = (field, id) => {
    const items = this.state.editable[field].includes(id) ?
      this.state.editable[field].filter(t => t !== id) :
      this.state.editable[field].concat([id]);

    this.setState({
      editable: {
        ...this.state.editable,
        [field]: items
      }
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

  handleUpdateStatus(status, items) {
    const {project} = this.props;
    const {editable} = this.state;

    this.props.saveInvoice({...editable, status}).then(invoice => {
      const {history} = this.props;
      this.setState({
        editable: {...invoice}
      });
      history.push(`/invoices/${project.id}/invoice/${invoice.id}`);
    });
  }

  handleSetDisplaySettings = (displaySettings) => {
    this.setState({
      editable: {
        ...this.state.editable,
        ...displaySettings,
      }
    });
  }

  render() {
    const {invoice, project} = this.props;
    const {
      editable, displaySettings, modifiers, timeslips = [], tasks = []
    } = this.state;
    const tasksWithTime = tasks.map(task => {
      task.timeslips = timeslips.filter(t => t.task === task.id);
      task.isActive = editable.tasks.includes(task.id);
      task.timeslips.forEach(ts => ts.isActive = editable.timeslips.includes(ts.id));
      return task;
    });
    const items = editable ? getDisplayItems(
      editable, project.hourly_rate, tasksWithTime
    ) : [];

    return (
      <React.Fragment>
        <NavMenu />

        <Container>
          <Grid>
            <Cell sm="12">
              {editable && (
                <InvoiceHeader
                  project={project}
                  invoice={editable}
                  onUpdateStatus={(status) => this.handleUpdateStatus(status, editable)}
                />
              )}
            </Cell>
          </Grid>

          <Styled>
            {editable && (
              <React.Fragment>
                <Generator
                  invoice={editable}
                  project={project}
                  items={items}
                  onSetDisplaySettings={this.handleSetDisplaySettings}
                  onRemove={({ itemType, id }) => this.handleToggleItem(itemType, id)}
                />
                <Settings
                  invoice={
                    getInvoiceTotals(editable, items, modifiers)
                  }
                  tasks={tasksWithTime}
                  project={project}
                  modifiers={modifiers}
                  reference={editable.reference}
                  dueDate={editable.due_date}
                  onRemoveModifier={(id) => this.handleToggleItem('modifier', id)}
                  onSetReference={(reference) => this.setReference(reference)}
                  onChange={this.handleChange}
                />
              </React.Fragment>
            )}
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
  const project = projects[projectId];
  const invoice =  state.invoice.items[invoiceId];

  return {
    invoiceId,
    invoice,
    project,
  };
};

export default connect(mapStateToProps, {
  saveInvoice,
  deleteInvoice,
  fetchInvoice,
  fetchTasks,
})(Invoice);
