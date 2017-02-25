'use strict';
import React from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';

import {Generator} from './generator';
import {Settings} from './settings';
import {InvoiceAdvanced} from './invoiceadvanced';
import {setHeaderBar} from '../../actions/nav';

import * as invoiceActions from '../../actions/invoices';


class Invoice extends React.Component {
  componentDidMount() {
    if (this.props.id !== 'add') {
      this.fetchInvoice().then(() => this.fetchData(this.props.id))
    }
  }

  fetchInvoice() {
    return this.props.fetchInvoice(this.props.id);
  }

  fetchData(id) {
    let promises = [
      this.props.fetchInvoiceTimeslips(id),
      this.props.fetchInvoiceTasks(id)
    ];
    return Promise.all(promises);
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div className='invoice-container'>
          <div className='content'>Loading</div>
        </div>
      );
    }
    let invoice = this.props.invoice;
    const modifiers = invoice.get('modifier');
    const project = this.props.project || Immutable.Map();

    return (
      <div className='invoice-container'>
        <div className='content'>
          <Settings
            invoice={invoice}
            project={project}
            timeslips={this.props.timeslips}
            tasks={this.props.tasks}
            modifiers={modifiers}
            onDelete={() =>
              this.props.deleteInvoice(invoice.get('id'))
            }
            onRemoveModifier={(modifier) =>
              this.props.deleteInvoiceModifier(
                invoice.get('id'),
                modifier.get('id')
              )
            }
          />
          <Generator
            invoice={invoice}
            project={project}
            timeslips={this.props.timeslips}
            tasks={this.props.tasks}
            modifiers={modifiers}
            onDeleteInvoiceTimeslip={(id) =>
              this.props.deleteInvoiceTimeslip(invoice.get('id'), id)
            }
          />
        </div>
      </div>
    );
  }
}

const getInvoiceProject = (invoice, projects)  => {
  const projectId = invoice.get('project').get('id');
  return projects.find((x) => x.get('id') === projectId);
};

const getInvoiceTimeslips = (invoice, timeslips) => {
  return timeslips.filter((t) => t.get('invoice') === invoice.get('id'));
}

const getInvoiceTasks = (invoice, tasks) => {
  return tasks.filter((t) => t.get('invoice') === invoice.get('id'));
}

const mapStateToProps = (state, { params }) => {
  const id = parseInt(params.id, 10);
  let mapState = {
    id,
    isLoading: true
  }

  const invoice = state.invoices.items.get(id);
  if (!invoice) {
    return mapState;
  }

  mapState.isLoading = false;
  mapState.invoice = invoice;
  mapState.project = getInvoiceProject(invoice, state.projects.items);
  mapState.timeslips = getInvoiceTimeslips(invoice, state.timeslips.items);
  mapState.tasks = getInvoiceTasks(invoice, state.tasks.items);
  return mapState;
};

const actions = {
  ...invoiceActions,
  setHeaderBar
};

const InvoiceContainer = connect(mapStateToProps, actions)(Invoice);
export {InvoiceContainer};

//           <InvoiceInfo
//             isIssued={isIssued}
//             project={project}
//             invoice={invoice}
//             timeslips={this.props.timeslips}
//             tasks={this.props.tasks}
//             modifiers={this.props.modifiers}
//             invoiceItems={this.props.invoiceItems}
//             onDelete={() =>
//               this.props.deleteInvoice(invoice.get('id'))
//             }
//             onMarkAsIssued={() =>
//               this.props.markAsIssued(
//                 invoice.get('id'),
//                 project.get('id'),
//                 this.props.timeslips
//               )
//             }
//             onMarkAsPaid={() => {
//               this.props.markAsPaid(
//                 invoice.get('id'),
//                 project.get('id'),
//                 invoice.get('total_due')
//               )
//             }}
//           />
//         </div>
//         <div className='col-md-8'>
//           <InvoiceAdvanced
//             isIssued={isIssued}
//             project={project}
//             invoice={invoice}
//             onUpdate={(updates) =>
//               this.props.updateInvoice(
//                 invoice.get('id'),
//                 project.get('id'),
//                 updates
//               )
//             }
//           />
//           <InvoiceTimeslips
//             isIssued={isIssued}
//             project={project}
//             timeslips={this.props.timeslips}
//             items={this.props.invoiceItems}
//             tasks={this.props.tasks}
//             onAddItem={(name, price, qty) =>
//               this.props.createItem(invoice.get('id'), name, price, qty)
//             }
//             onDeleteInvoiceTimeslip={(timeslipId) =>
//               this.props.deleteInvoiceTimeslip(invoice.get('id'), timeslipId)
//             }
//             onDeleteInvoiceItem={(itemId) =>
//               this.props.deleteInvoiceItem(invoice.get('id'), itemId)
//             }
//             onDeleteTask={(taskId) =>
//               this.props.deleteInvoiceTask(invoice.get('id'), taskId)
//             }
//           />
