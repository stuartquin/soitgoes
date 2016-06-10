import React from 'react';
import {connect} from 'react-redux';

import { InvoiceCreate } from './invoicecreate';

class Invoices extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <InvoiceCreate />
    );
  }
}

const mapStateToProps = (allState, props) => {
  'use strict';
  return {
  };
};

const mapDispatchToProps = (dispatch, props) => {
  'use strict';
  return {
  };
};

const InvoicesContainer = connect(mapStateToProps, mapDispatchToProps)(Invoices);
export {InvoicesContainer};
