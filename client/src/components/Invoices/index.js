import React from 'react';
import {connect} from 'react-redux';

import NavMenu from 'components/nav/navmenu';
import ActionButton from 'components/ActionButton';
import InvoiceTable from 'components/Invoices/InvoiceTable';
import {Grid, Cell} from 'components/Grid';

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
    this.props.fetchInvoices().then(() => {
      this.setState({isLoading: false});
    });
  }

  handleNewInvoice() {
  }

  render() {
    const {invoices, projects} = this.props;

    return (
      <React.Fragment>
        <NavMenu>
          <ActionButton onClick={this.handleNewInvoice}>
            New Invoice
          </ActionButton>
        </NavMenu>

        <InvoiceTable
          invoices={invoices}
          projects={projects}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  const project = selectJoined(state.project.items, state);
  return {
    projects: state.project.items,
    contacts: state.contact.items,
    invoices: selectResults(
      selectJoined(state.invoice.items, {project}),
      state.invoice.results,
    ),
  };
};

const actions = {
  fetchInvoices,
};

export default connect(mapStateToProps, actions)(Invoices);
