'use strict';
import React from 'react';

const TextField = (props) => {
  const label = props.label;
  const value = props.value;
  const type = props.type || 'text';
  const placeholder = props.placeholder || label;

  return (
    <div className='form-field'>
      <label>{label}</label>
      <div>
        <input
          className='form-control'
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(evt) => props.onChange(evt.target.value)} />
      </div>
    </div>
  );
};

const SelectField = (props) => {
  const label = props.label;
  const value = props.value;
  const options = props.options || [];

  return (
    <div className='form-field'>
      <label>{label}</label>
      <div>
        <select
          className='form-control'
          value={props.value}
          onChange={(evt) => props.onChange(evt.target.value)}>
          {options.map(opt =>
            <option
              key={opt.value}
              value={opt.value}>
              {opt.label}
            </option>
          )}
        </select>
      </div>
    </div>
  );
};

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
        due_date: task.get('due_date')
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
    this.props.onSave(this.state.form);
  }

  render() {
    const projects = this.props.projects.toList().toJS().map(p => {
      return {value: p['id'], label: p['name']};
    });

    const saveButtonText = 'Save';
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          <div className='form-row'>
            <TextField
              value={this.state.form.name}
              onChange={(val) => this.handleChange('name', val)}
              label='Task Name' />
          </div>
          <div className='form-row'>
            <SelectField
              value={this.state.form.project}
              onChange={(val) => this.handleChange('project', val)}
              options={projects}
              label='Project' />
            <TextField
              type='number'
              value={this.state.form.cost}
              onChange={(val) => this.handleChange('cost', val)}
              label='Cost' />
            <TextField
              type='date'
              value={this.state.form.due_date}
              onChange={(val) => this.handleChange('due_date', val)}
              label='Due' />
          </div>
        </div>
        <div className='panel-footer'>
          <div className='form-row'>
            <button
              className='btn btn-success btn-block btn-raised'
              onClick={() => this.onSave()}>
              {saveButtonText}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export {TaskForm};
