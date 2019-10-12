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
import {getDisplayItems, getNewInvoice} from 'services/invoice';

import {fetchInvoice, deleteInvoice, saveInvoice} from 'modules/invoice';
import {fetchTasks} from 'modules/task';
import {fetchTimeslips} from 'modules/timeslip';
import {fetchModifiers} from 'services/modifier';

const getInvoiceTotals = (invoice, items) => {
  const {modifier = []} = invoice;
  const [totalHours, subTotal] = items.reduce(([h, s], {hours, subTotal}) => (
    [h + hours, s + subTotal]
  ), [0, 0]);
  const total = modifier.reduce((prev, mod) => (
    prev + getModifierImpact(mod, subTotal)
  ), subTotal);

  return {
    ...invoice,
    subtotal_due: subTotal,
    total_due: total,
    totalHours,
    modifier,
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
    const {invoiceId, project} = this.props;
    this.fetchData().then(([invoice, modifier]) => {
      const editable = invoice.id ?
        {...invoice} :
        {...invoice, modifier: modifier.results};

      this.setState({ editable });
    });
  }

  fetchData() {
    const {invoiceId, project} = this.props;
    const promises = invoiceId ? [
      this.props.fetchInvoice(invoiceId, { project: project.id }),
      fetchModifiers(),
      this.props.fetchTimeslips(invoiceId, null, null, project.id),
      this.props.fetchTasks(project.id),
    ] : [
      this.props.fetchInvoice('new', { project: project.id }),
      fetchModifiers(),
      this.props.fetchTimeslips('none', null, null, project.id),
      this.props.fetchTasks(project.id),
    ];

    return Promise.all(promises);
  }

  handleRemove(field, id) {
    const items = this.state.editable[field].filter(t => t.id !== id);
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
    const saveable = {
      ...editable,
      modifier: editable.modifier.map(m => m.id),
    };

    this.props.saveInvoice({...saveable, status}).then(({id}) => {
      const {history} = this.props;
      history.push(`/project/${project.id}/invoice/${id}`);
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
    const {invoice, project, tasks, timeslips} = this.props;
    const {
      editable, displaySettings
    } = this.state;

    if (!editable || !project) {
      return (<Loading />);
    }
    const items = getDisplayItems(
      editable, project.hourly_rate, timeslips, tasks
    );

    return (
      <React.Fragment>
        <NavMenu />

        <Container>
          <Grid>
            <Cell sm="12">
              <InvoiceHeader
                project={project}
                invoice={editable}
                onUpdateStatus={(status) => this.handleUpdateStatus(status, editable)}
              />
            </Cell>
          </Grid>

          <Styled>
            <Generator
              invoice={editable}
              items={items}
              onSetDisplaySettings={this.handleSetDisplaySettings}
              onRemove={({ itemType, id }) => this.handleRemove(itemType, id)}
            />
            <Settings
              invoice={
                getInvoiceTotals(editable, items)
              }
              project={project}
              modifiers={editable.modifier || []}
              reference={editable.reference}
              dueDate={editable.due_date}
              onRemoveModifier={(id) => this.handleRemove('modifier', id)}
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
  const project = projects[projectId];
  const invoice =  state.invoice.items[invoiceId];

  return {
    invoiceId,
    invoice,
    project,
    timeslips: selectResults(state.timeslip.items, state.timeslip.results),
    tasks: selectResults(state.task.items, state.task.results),
  };
};

export default connect(mapStateToProps, {
  saveInvoice,
  deleteInvoice,
  fetchInvoice,
  fetchTasks,
  fetchTimeslips,
})(Invoice);
