'use strict';
import React from 'react';
import moment from 'moment';

import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import { InvoiceSummary } from './invoicesummary';


class Settings extends React.Component {
  render() {
    const invoice = this.props.invoice;
    const project = this.props.project;
    const isEditable = this.props.isEditable;
    const dueDate = moment(this.props.dueDate).toDate();

    return (
      <div className='settings'>
        <div>
          <DatePicker
            textFieldStyle={{width: '100%'}}
            onChange={(e, date) => {
              this.props.onSetDueDate(moment(date).format('YYYY-MM-DD'));
            }}
            autoOk={true}
            floatingLabelText='Due Date'
            defaultDate={dueDate}
            disabled={!isEditable}
          />
        </div>

        <div>
          <TextField
            style={{width: '100%'}}
            value={this.props.reference}
            onChange={(evt, val) => this.props.onSetReference(val)}
            floatingLabelText='Reference'
          />
        </div>

        <InvoiceSummary
          project={project}
          invoice={invoice}
          timeslips={this.props.timeslips}
          tasks={this.props.tasks}
          modifiers={this.props.modifiers}
          total={this.props.total}
          onAddModifier={this.props.onAddModifier}
          onRemoveModifier={this.props.onRemoveModifier}
        />
      </div>
    );
  }
}

export {Settings}
