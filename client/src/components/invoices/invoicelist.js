import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { asCurrency } from 'services/currency';

import { StateChip } from './state-chip';

const groupByMonth = (invoices) => {
  let grouped = {};
  invoices.forEach((inv) => {
    const date = inv.due_date.substring(0, 7);

    if (grouped[date]) {
      grouped[date].push(inv);
    } else {
      grouped[date] = [inv];
    }
  });

  return grouped;
};

const getInvoiceName = (invoice, projects) => {
  const project = projects[invoice.project] || {};
  return `#${invoice.sequence_num} ${project.name}`;
};

class InvoiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthSelected: {}
    };
  }

  isSelected (id) {
    return this.props.selectedInvoiceIds.indexOf(id) > -1;
  }

  getRows (month, invoices, projects) {
    return invoices.map((invoice) => {
      const project = projects[invoice.project];
      let totalClass = 'text-danger';
      let total = invoice.total_due;
      if (invoice.total_paid) {
        totalClass = 'text-success';
        total = invoice.total_paid;
      }

      console.log('Invoice', invoice);
      return (
        <tr key={invoice.id} className='invoice-list-row'>
          <td className='invoice-list-col'>
            <Link to={`/invoices/${invoice.id}`}>
              #{invoice.sequence_num} {project.name}
            </Link>
          </td>
          <td className='invoice-list-col'>
            <span className={ totalClass }>{asCurrency(total, project.currency)}</span>
          </td>
          <td className='invoice-list-col'>
            <StateChip invoice={invoice} />
          </td>
        </tr>
      );
    });
  }

  handleSelectRow (grouped, month, selected) {
    const monthIds = grouped[month].map(invoice => invoice.id);
    const selectedIds = selected.map((idx) => grouped[month][idx].id);
    const unSelectedIds = monthIds.filter((id) => selectedIds.indexOf(id) === -1);

    this.props.onSelectInvoice(selectedIds, unSelectedIds);
  }

  render () {
    const { projects, invoices } = this.props;
    const grouped = groupByMonth(invoices);
    const months = Object.keys(grouped);

    if (grouped['2018-10']) {
      console.log('Rows', this.getRows('2018-10', grouped['2018-10'], projects));
    }

    return (
      <table>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice.id} className='invoice-list-row'>
              <td className='invoice-list-col'>
                <Link to={`/invoices/${invoice.id}`}>
                  {getInvoiceName(invoice, projects)}
                </Link>
              </td>
              <td className='invoice-list-col'>
                <span>
                  {asCurrency(invoice.total_due, projects[invoice.project].currency)}
                </span>
              </td>
              <td className='invoice-list-col'>
                <StateChip invoice={invoice} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export {InvoiceList};
