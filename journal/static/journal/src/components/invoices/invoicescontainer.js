'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {Card, CardText} from 'material-ui/Card';

import {InvoiceList} from './invoicelist';
import {CreateInvoice} from './createinvoice';
import {HeaderBar} from '../nav/headerbar';
import {Loading} from '../loading';
import {Confirm} from '../confirm';
import * as invoiceActions from '../../actions/invoices';


class Invoices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceId: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    return Promise.all([
      this.props.fetchInvoices()
    ]);
  }

  render() {
    if (this.props.view.get('isLoading')) {
      return (<Loading />);
    }

    const openInvoices = this.props.invoices.toList().filter((invoice) => {
      return invoice.get('paid_at') === null;
    });

    const closedInvoices = this.props.invoices.toList().filter((invoice) => {
      return invoice.get('paid_at') !== null;
    });

    return (
      <div className='invoices-container'>
        <Confirm
          title='Confirm Delete'
          open={this.state.invoiceId !== null}
          onConfirm={() => {
            this.props.deleteInvoice(this.state.invoiceId);
            this.setState({invoiceId: null});
          }}
          onCancel={() => this.setState({invoiceId: null})}>
          Are you sure you want to delete?
        </Confirm>

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
                onDeleteInvoice={(id) => this.setState({invoiceId: id})}
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
    invoices: state.invoices.items,
    view: state.invoices.view
  };
};

const actions = {
  ...invoiceActions,
};

const InvoicesContainer = connect(mapStateToProps, actions)(Invoices);
export {InvoicesContainer};
