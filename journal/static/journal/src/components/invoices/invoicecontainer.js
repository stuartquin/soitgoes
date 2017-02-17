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
      this.props.fetchInvoiceItems(id),
      this.props.fetchInvoiceTasks(id)
    ];
    return Promise.all(promises);
  }

  render() {
    const invoice = this.props.invoice || Immutable.Map();
    const project = this.props.project || Immutable.Map();

    return (
      <div className='invoice-container'>
        <div className='content'>
          <Generator
            invoice={invoice}
            project={project}
            timeslips={this.props.timeslips}
            tasks={this.props.tasks}
            modifiers={this.props.modifiers}
            onDeleteInvoiceTimeslip={(id) =>
              this.props.deleteInvoiceTimeslip(invoice.get('id'), id)
            }
          />
        </div>
      </div>
    );
  }
}

const getInvoiceProject = (projects, invoice) => {
  return projects.find((x) => x.get('id') === invoice.get('project'));
};

const getInvoiceTimeslips = (invoice, timeslips) => {
  const invoiceId = invoice.get('id');
  return timeslips.filter((t) => t.get('invoice') === invoiceId);
}

const mapStateToProps = (state, { params }) => {
  const view = state.invoice;
  const invoice = view.details;
  const project = getInvoiceProject(state.projects.items, invoice);
  const timeslips = getInvoiceTimeslips(invoice, state.timeslips.items);
  const invoiceId = parseInt(params.id, 10);
  const tasks = state.tasks.items.filter((task) =>
    task.get('invoice') === invoiceId
  );

  return {
    invoice,
    project,
    timeslips,
    isLoading: view.view.get('isLoading'),
    invoiceItems: view.additionalItems,
    tasks: tasks,
    id: params.id,
    modifiers: view.modifiers
  };
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
