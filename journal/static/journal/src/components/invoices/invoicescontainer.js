'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import {InvoiceList} from './invoicelist';
import {CreateInvoice} from './createinvoice';
import {Loading} from '../loading';
import {Confirm} from '../confirm';
import {
  fetchInvoices, fetchNext, deleteInvoice, createInvoice
} from 'modules/invoice';

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

    const next = this.props.view.get('next');
    const openInvoices = this.props.invoices.toList().filter((invoice) => {
      return invoice.get('paid_at') === null;
    });

    const closedInvoices = this.props.invoices.toList().filter((invoice) => {
      return invoice.get('paid_at') !== null;
    });

    const loadMore = next ? (
      <RaisedButton
        className='btn-success'
        label='Load More'
        onTouchTap={(evt) => {
          evt.preventDefault();
          this.props.fetchNext(next);
        }}
      />
    ) : null;

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
              <h3 className='invoice-list-header'>Open</h3>
              <InvoiceList
                projects={this.props.projects}
                invoices={openInvoices}
                onDeleteInvoice={(id) => this.setState({invoiceId: id})}
              />

              <h3 className='invoice-list-header'>Closed</h3>
              <InvoiceList
                projects={this.props.projects}
                invoices={closedInvoices}
                onDeleteInvoice={(id) => this.setState({invoiceId: id})}
              />
              <div className='invoice-load-more'>
                {loadMore}
              </div>
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
  fetchInvoices,
  fetchNext,
  deleteInvoice,
  createInvoice
};

const InvoicesContainer = connect(mapStateToProps, actions)(Invoices);
export {InvoicesContainer};
