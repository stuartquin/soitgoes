import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table';

import { StateChip } from './state-chip';

const groupByMonth = (invoices) => {
  let grouped = {};
  invoices.forEach((inv) => {
    const date = inv.get('due_date').substring(0, 7);

    if (grouped[date]) {
      grouped[date].push(inv);
    } else {
      grouped[date] = [inv];
    }
  });

  return grouped;
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
      const id = invoice.get('id');
      const project = projects.get(invoice.get('project'));
      let totalClass = 'text-danger';
      let total = invoice.get('total_due');
      if (invoice.get('total_paid')) {
        totalClass = 'text-success';
        total = invoice.get('total_paid');
      }

      return (
        <TableRow
          key={id}
          className='invoice-list-row'
          selected={this.isSelected(invoice.get('id'))}>
          <TableRowColumn className='invoice-list-col'>
            <Link to={`/invoices/${invoice.get('id')}`}>
              #{invoice.get('sequence_num')} {project.get('name')}
            </Link>
          </TableRowColumn>
          <TableRowColumn className='invoice-list-col'>
            <span className={ totalClass }>&pound;{total}</span>
          </TableRowColumn>
          <TableRowColumn className='invoice-list-col'>
            <StateChip invoice={invoice} />
          </TableRowColumn>
        </TableRow>
      );
    });
  }

  handleSelectRow (grouped, month, selected) {
    const monthIds = grouped[month].map(invoice => invoice.get('id'));
    const selectedIds = selected.map((idx) => grouped[month][idx].get('id'));
    const unSelectedIds = monthIds.filter((id) => selectedIds.indexOf(id) === -1);

    this.props.onSelectInvoice(selectedIds, unSelectedIds);
  }

  render () {
    const { projects, invoices } = this.props;
    const grouped = groupByMonth(invoices);
    const months = Object.keys(grouped);

    return (
      <div>
        {months.map((month, idx) => {
          return (
            <Table key={idx}
              multiSelectable={true}
              onRowSelection={(selected) => {
                this.handleSelectRow(grouped, month, selected);
              }}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn colSpan='3' style={{paddingLeft: 0}}>
                    {moment(`${month}-01`).format('MMMM YYYY')}
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
             <TableBody deselectOnClickaway={false}>
              {this.getRows(month, grouped[month], projects)}
             </TableBody>
            </Table>
          );
        })}
      </div>
    );
  }
}

export {InvoiceList};
