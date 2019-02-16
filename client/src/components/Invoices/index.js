import React from 'react';
import {connect} from 'react-redux';

import Button from 'components/Button';
import InvoiceSummary from 'components/Invoices/InvoiceSummary';
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
  }

  componentDidMount() {
    this.props.fetchTimeslips('none');
    this.props.fetchInvoices().then(() => {
      this.setState({isLoading: false});
    });
  }

  render() {
    const {invoices, timeslips, projects} = this.props;
    const total = getTotal(invoices, 'ISSUED');
    const overdue = getTotal(getOverdue(invoices));
    const unbilled = getHourlyTotal(timeslips, projects);

    console.log('Invoices', invoices);

    return (
      <React.Fragment>
        <InvoiceSummary
          total={total}
          overdue={overdue}
          unbilled={unbilled}
        />
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
    timeslips: Object.values(state.timeslip.items),
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
