'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {Card, CardText} from 'material-ui/Card';

import {InvoiceList} from './invoicelist';
import {CreateInvoice} from './createinvoice';
import {HeaderBar} from '../nav/headerbar';
import * as invoiceActions from '../../actions/invoices';

import {setHeaderBar} from '../../actions/nav';


class Invoices extends React.Component {
  componentDidMount() {
    this.fetchData();
    this.props.setHeaderBar('Invoices');
  }

  fetchData() {
    return Promise.all([
      this.props.fetchInvoices()
    ]);
  }

  render() {
    if (this.props.projects.isEmpty()) {
      return (<strong>Loading...</strong>);
    }

    if (this.props.invoices.isEmpty()) {
      return (<strong>No invoices</strong>);
    }

    const openInvoices = this.props.invoices.filter((invoice) => {
      return invoice.get('paid_at') === null;
    });

    const closedInvoices = this.props.invoices.filter((invoice) => {
      return invoice.get('paid_at') !== null;
    });

    return (
      <div className='invoices-container'>
        <div className='content'>
          <CreateInvoice
            projects={this.props.projects}
            onCreateInvoice={this.props.createInvoice}
          />
          <Card>
            <CardText>
              <h3>Open Invoices ({openInvoices.size})</h3>
              <InvoiceList
                projects={this.props.projects}
                invoices={openInvoices}
                onDeleteInvoice={(id) => this.props.deleteInvoice(id)}
              />

              <h3>Closed Invoices ({closedInvoices.size})</h3>
              <InvoiceList
                projects={this.props.projects}
                invoices={closedInvoices}
              />
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects.items,
    invoices: state.invoices.items
  };
};

const actions = {
  ...invoiceActions,
  setHeaderBar
};

const InvoicesContainer = connect(mapStateToProps, actions)(Invoices);
export {InvoicesContainer};
