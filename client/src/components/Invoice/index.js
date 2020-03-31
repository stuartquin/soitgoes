import React from 'react';
import styled from 'styled-components';
import { Card, Box, Flex } from 'rebass/styled-components';
import moment from 'moment';

import { connect } from 'react-redux';

import { BREAKPOINTS, Container, Grid, Cell } from 'components/Grid';
import InvoiceHeader from 'components/Invoice/InvoiceHeader';
import DisplaySettings from './DisplaySettings';
import Settings from 'components/Invoice/Settings';

import { getWithJoined, selectJoined, selectResults } from 'services/selectors';
import { getModifierImpact } from 'services/modifier';
import { fetchInvoice, saveInvoice } from 'services/invoice';

import { fetchTasks, getTaskTotal } from 'services/task';
import { fetchTimeslips, saveTimeslip } from 'services/timeslip';
import { fetchModifiers } from 'services/modifier';

import TaskOverview from './TaskOverview';

const getInvoiceTotals = (invoice, tasks, timeslips, modifiers) => {
  const modifier = invoice.modifier.map(id => modifiers.find(m => id === m.id));
  const taskIds = invoice ? invoice.tasks : [];
  const timeslipIds = invoice ? invoice.timeslips : [];
  const activeTimeslips = timeslips.filter(ts => timeslipIds.includes(ts.id));
  const subTotal = tasks
    .filter(task => taskIds.includes(task.id))
    .reduce(
      (total, task) =>
        (total += getTaskTotal(
          task,
          activeTimeslips.filter(ts => ts.task === task.id)
        )),
      0
    );

  const total = modifier.reduce(
    (prev, mod) => prev + getModifierImpact(mod, subTotal),
    subTotal
  );
  return {
    ...invoice,
    subtotal_due: invoice.subtotal_due || subTotal,
    total_due: invoice.total_due || total,
  };
};

const Styled = styled(Flex)`
  background: #f5f3f5;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0, 0%, 40%, 0.2);
  height: 100%;
  min-height: 400px;
  max-width: 1200px;
  width: 100%;

  @media (max-width: ${BREAKPOINTS.sm}) {
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
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
  }

  componentDidMount() {
    const { invoiceId, project } = this.props;
    this.fetchData().then(([invoice, modifier, timeslips, tasks]) => {
      const editable = invoice.id
        ? { ...invoice, modifier: invoice.modifier || [] }
        : { ...invoice, modifier: modifier.results.map(m => m.id) };

      this.setState({
        editable,
        modifiers: modifier.results,
        timeslips: timeslips.results,
        tasks: tasks.results,
      });
    });
  }

  fetchData() {
    const { invoiceId, project } = this.props;
    const promises = invoiceId
      ? [
          fetchInvoice(invoiceId, { project: project.id }),
          fetchModifiers(),
          fetchTimeslips({ invoice: invoiceId, project: project.id }),
          fetchTasks({ project: project.id, invoice: invoiceId }),
        ]
      : [
          fetchInvoice('new', { project: project.id }),
          fetchModifiers(),
          fetchTimeslips({ invoice: 'none', project: project.id }),
          fetchTasks({ project: project.id, invoice: 'none' }),
        ];

    return Promise.all(promises);
  }

  handleToggleItem = (field, id) => {
    const items = this.state.editable[field].includes(id)
      ? this.state.editable[field].filter(t => t !== id)
      : this.state.editable[field].concat([id]);

    this.setState({
      editable: {
        ...this.state.editable,
        [field]: items,
      },
    });
  };

  handleChange({ target }) {
    this.setState({
      editable: {
        ...this.state.editable,
        [target.name]: target.value,
      },
    });
  }

  handleUpdateStatus(status, items) {
    const { project } = this.props;
    const { editable, timeslips } = this.state;
    const isActiveTimeslip = ts =>
      editable.tasks.includes(ts.task) && editable.timeslips.includes(ts.id);
    const saveable = {
      ...editable,
      status,
      timeslips: timeslips.filter(isActiveTimeslip).map(ts => ts.id && ts.cost),
    };

    saveInvoice(saveable).then(invoice => {
      const { history } = this.props;
      this.setState({
        editable: { ...invoice },
      });
      history.push(`/invoices/${project.id}/invoice/${invoice.id}`);
    });
  }

  handleSetDisplaySettings = displaySettings => {
    this.setState({
      editable: {
        ...this.state.editable,
        ...displaySettings,
      },
    });
  };

  handleMoveTimeslip = async (task, timeslipId) => {
    const { invoiceId, project } = this.props;
    const timeslip = this.state.timeslips.find(({ id }) => id === timeslipId);
    await saveTimeslip({ ...timeslip, task: task.id });
    const res = await fetchTimeslips({ invoice: 'none', project: project.id });
    this.setState({
      timeslips: res.results,
    });
  };

  render() {
    const { invoice, project } = this.props;
    const {
      editable,
      displaySettings,
      modifiers = [],
      timeslips = [],
      tasks = [],
    } = this.state;

    const getTaskTimeslips = task =>
      timeslips.filter(ts => ts.task === task.id && ts.cost);

    const isEditable = editable && !editable.id;
    return (
      <React.Fragment>
        {editable && (
          <InvoiceHeader
            project={project}
            invoice={editable}
            onUpdateStatus={status => this.handleUpdateStatus(status, editable)}
          />
        )}

        <Flex flexWrap="wrap" flexDirection={['column-reverse', 'row']}>
          {editable && (
            <React.Fragment>
              <Card flexGrow="1" mr={[0, 16]} backgroundColor="white">
                <DisplaySettings
                  isEditable={isEditable}
                  displaySettings={editable}
                  onChange={this.handleSetDisplaySettings}
                />
                {tasks.map(task => (
                  <TaskOverview
                    invoice={editable}
                    task={task}
                    timeslips={getTaskTimeslips(task)}
                    onToggle={this.handleToggleItem}
                    onMoveTimeslip={this.handleMoveTimeslip}
                  />
                ))}
              </Card>
              <Settings
                invoice={getInvoiceTotals(
                  editable,
                  tasks,
                  timeslips,
                  modifiers
                )}
                tasks={tasks}
                project={project}
                modifiers={modifiers}
                reference={editable.reference}
                dueDate={editable.due_date}
                onRemoveModifier={id => this.handleToggleItem('modifier', id)}
                onSetReference={reference => this.setReference(reference)}
                onChange={this.handleChange}
              />
            </React.Fragment>
          )}
        </Flex>
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
  const invoice = state.invoice.items[invoiceId];

  return {
    invoiceId,
    invoice,
    project,
  };
};

export default connect(
  mapStateToProps,
  {}
)(Invoice);
