import React from 'react';
import moment from 'moment';

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
          <input
            style={{width: '100%'}}
            value={this.props.reference}
            onChange={(evt, val) => this.props.onSetReference(val)}
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
