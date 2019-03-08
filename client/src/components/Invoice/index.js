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
import {getIssuedInvoice} from 'services/invoice';

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

  @media(max-width: ${BREAKPOINTS.sm}) {
    flex-direction: column-reverse;
  }
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

    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleRemove(field, id) {
    const {editableInvoice} = this.state;
    const items = editableInvoice[field].filter(t => t.id !== id);
    this.setState({
      editableInvoice: {
        ...editableInvoice,
        [field]: items
      }
    });
  }

  handleChange({target}) {
    this.setState({
      editableInvoice: {
        ...this.state.editableInvoice,
        [target.name]: target.value,
      }
    });
  }

  handleUpdateStatus(status) {
    const {editableInvoice} = this.state;
    const {project} = editableInvoice;
    const invoice = status === 'ISSUED' ?
      getIssuedInvoice(editableInvoice) :
      {...editableInvoice};

    this.props.saveInvoice(invoice).then(({id}) => {
      const {history} = this.props;
      history.push(`/project/${project.id}/invoice/${id}`);
    });
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
            <Generator
              invoice={editableInvoice}
              isEditable={isEditable}
              onRemoveTimeslip={(id) => this.handleRemove('timeslips', id)}
              onRemoveTask={(id) => this.handleRemove('tasks', id)}
            />
            <Settings
              invoice={getInvoiceTotals(editableInvoice)}
              isEditable={isEditable}
              dueDate={dueDate}
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
  const invoice = invoiceId ? getWithJoined(
    state.invoice.items[invoiceId] || {}, {project: projects}
  ) : {
    project: projects[projectId] || {},
    due_date: moment().add(14, 'days').format('YYYY-MM-DD'),
  };

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
