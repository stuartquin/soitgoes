import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';

import NavMenu from 'components/nav/navmenu';
import ActionButton from 'components/ActionButton';
import InvoiceTable from 'components/Invoices/InvoiceTable';
import UpcomingSummary from 'components/Invoices/UpcomingSummary';
import Heading from 'components/Heading';
import {Container, Grid, Cell} from 'components/Grid';

import {fetchInvoices} from 'modules/invoice';
import {fetchTimeslips} from 'modules/timeslip';
import {getTotal, getOverdue} from 'services/invoice';
import {getHourlyTotal} from 'services/timeslip';
import {selectJoined, selectResults} from 'services/selectors';

class Invoices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }

    this.handleNewInvoice = this.handleNewInvoice.bind(this);
  }

  componentDidMount() {
    this.props.fetchTimeslips('none');
    this.props.fetchInvoices().then(() => {
      this.setState({isLoading: false});
    });
  }

  handleNewInvoice() {
  }

  render() {
    const {invoices, timeslips} = this.props;

    return (
      <React.Fragment>
        <NavMenu>
          <ActionButton onClick={this.handleNewInvoice}>
            New Invoice
          </ActionButton>
        </NavMenu>

        <Container>
          <div>
            <Heading size="h2">Upcoming Invoices</Heading>
            <UpcomingSummary
              timeslips={timeslips}
            />

            <Heading size="h2">Issued Invoices</Heading>
            <InvoiceTable
              invoices={invoices}
            />
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const project = selectJoined(state.project.items, state);
  return {
    timeslips: selectResults(
      selectJoined(state.timeslip.items, {project}),
      state.timeslip.results,
    ),
    invoices: selectResults(
      selectJoined(state.invoice.items, {project}),
      state.invoice.results,
    ),
  };
};

const actions = {
  fetchInvoices,
  fetchTimeslips,
};

export default connect(mapStateToProps, actions)(Invoices);
