'use strict';
import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import { InvoiceTimeslips } from './invoicetimeslips';

const getDefaultName = (invoice, project) => {
  return `${project.get('name')} #${invoice.get('sequence_num')}`;
};

class Generator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: getDefaultName(props.invoice, props.project)
      }
    };
  }

  updateForm(name, val) {
    let form = this.state.form;
    form[name] = val;
    this.setState({form});
  }

  render() {
    const invoice = this.props.invoice;
    const project = this.props.project;
    const name = getDefaultName(invoice, project);
    const isIssued = false;

    return (
      <Card className='invoice-generator'>
        <CardText>
          <h3>{name}</h3>

          <h4>Tracked Time</h4>
          <InvoiceTimeslips
            isIssued={isIssued}
            project={project}
            timeslips={this.props.timeslips}
            items={this.props.invoiceItems}
            tasks={this.props.tasks}
            onAddItem={(name, price, qty) =>
              this.props.createItem(invoice.get('id'), name, price, qty)
            }
            onDeleteInvoiceTimeslip={(timeslipId) =>
              this.props.deleteInvoiceTimeslip(invoice.get('id'), timeslipId)
            }
            onDeleteInvoiceItem={(itemId) =>
              this.props.deleteInvoiceItem(invoice.get('id'), itemId)
            }
            onDeleteTask={(taskId) =>
              this.props.deleteInvoiceTask(invoice.get('id'), taskId)
            }
          />
        </CardText>
      </Card>
    );
  }
}

export {Generator}
