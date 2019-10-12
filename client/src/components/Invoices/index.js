import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';

import NavMenu from 'components/nav/navmenu';
import InvoiceTable from 'components/Invoices/InvoiceTable';
import UpcomingSummary from 'components/Invoices/UpcomingSummary';
import Heading from 'components/Heading';
import {Container, Grid, Cell} from 'components/Grid';
import {Button} from 'components/GUI';

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
    const NewButton = (
      <Button type="success">New</Button>
    );

    return (
      <React.Fragment>
        <NavMenu />

        <Container>
          <Heading
            size="h2"
            action={NewButton}
          >
            Upcoming Invoices
          </Heading>
          <UpcomingSummary
            timeslips={timeslips}
          />

          <Heading size="h2">Issued Invoices</Heading>
          <InvoiceTable
            invoices={invoices}
          />
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
