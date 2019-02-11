import React from 'react';
import {connect} from 'react-redux';

import Button from 'components/Button';
import InvoiceSummary from 'components/Invoices/InvoiceSummary';
import {Grid, Cell} from 'components/Grid';

import {fetchInvoices} from 'modules/invoice';
import {fetchTimeslips} from 'modules/timeslip';
import {getTotal, getOverdue} from 'services/invoice';
import {getHourlyTotal} from 'services/timeslip';

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

    console.log(getOverdue(invoices), overdue);

    return (
      <React.Fragment>
        <InvoiceSummary
          total={total}
          overdue={overdue}
          unbilled={unbilled}
        />
      </React.Fragment>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    projects: state.projects.items,
    invoices: Object.values(state.invoices.items),
    timeslips: Object.values(state.timeslips.items),
  };
};

const actions = {
  fetchInvoices,
  fetchTimeslips,
};

export default connect(mapStateToProps, actions)(Invoices);
