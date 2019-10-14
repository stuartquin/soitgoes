import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import { Text, Flex } from 'rebass/styled-components';

import NavMenu from 'components/nav/navmenu';
import InvoiceTable from 'components/Invoices/InvoiceTable';
import UpcomingSummary from 'components/Invoices/UpcomingSummary';
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

    return (
      <React.Fragment>
        <NavMenu />

        <Container>
          <Flex alignItems="center" justifyContent="flex-end" mb={12}>
            <Button ml={2}>New</Button>
          </Flex>

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
