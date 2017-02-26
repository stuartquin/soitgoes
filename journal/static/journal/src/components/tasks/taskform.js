'use strict';
import React from 'react';
import moment from 'moment';

import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


class TaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: !!props.isEdit,
      form: {}
    };

    const task = props.task;
    if (task) {
      this.state.form = {
        name: task.get('name'),
        project: task.get('project'),
        cost: task.get('cost'),
        due_date: moment(task.get('due_date')).toDate()
      };
    } else {
      this.state.form = {
        project: this.props.projects.first().get('id')
      };
    };
  }

  handleChange(field, val) {
    let form = this.state.form;
    form[field] = val;
    this.setState({form: form});
  }

  onSave() {
    this.props.onSave({
      ...this.state.form,
      due_date: moment(this.state.form.due_date).format('YYYY-MM-DD')
    });
  }

  render() {
    const projects = this.props.projects.toList().toJS().map(p => {
      return (
        <MenuItem
          key={p.id}
          value={p.id}
          primaryText={p.name}
        />
      );
    });

    return (
      <div className='settings'>
        <TextField
          style={{width: '100%'}}
          value={this.state.form.name}
          onChange={(evt, val) => this.handleChange('name', val)}
          floatingLabelText='Task Name' />
        <SelectField
          style={{width: '100%'}}
          value={this.state.form.project}
          onChange={(evt, idx, val) => this.handleChange('project', val)}
          floatingLabelText='Project'>
          {projects}
        </SelectField>
        <TextField
          style={{width: '100%'}}
          type='number'
          value={this.state.form.cost}
          onChange={(evt, val) => this.handleChange('cost', val)}
          floatingLabelText='Cost' />
        <DatePicker
          textFieldStyle={{width: '100%'}}
          onChange={(e, date) => this.handleChange('due_date', date)}
          autoOk={true}
          floatingLabelText='Due Date'
          defaultDate={this.state.form.due_date}
          container='inline'
        />
        <RaisedButton
          className='btn-success'
          label='Save'
          labelPosition='before'
          onTouchTap={(evt) => {
            this.onSave()
          }}
        />
      </div>
    );
  }
}

export {TaskForm};
