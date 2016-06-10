import React from 'react';
import {connect} from 'react-redux';

class Invoices extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <h2>Invoices</h2>
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
