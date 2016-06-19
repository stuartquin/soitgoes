'use strict';
import React from 'react';
import {connect} from 'react-redux';

import { ToInvoice } from './toinvoice';
import { InvoiceList } from './invoicelist';
import * as actions from '../actions/projects';

class Invoices extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.props.fetchProjects();
  }

  render() {
    return (
      <div>
        <ToInvoice
          projectSummary={this.props.projectSummary}
        />
        <InvoiceList
          projectSummary={this.props.projectSummary}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ invoices }, props) => {
  return {
    projectSummary: invoices.projectSummary
  };
};

const InvoicesContainer = connect(mapStateToProps, actions)(Invoices);
export {InvoicesContainer};
