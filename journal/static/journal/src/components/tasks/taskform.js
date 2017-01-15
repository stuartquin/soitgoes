'use strict';
import React from 'react';
import {connect} from 'react-redux';

import * as taskActions from '../../actions/tasks';

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
  const type = props.type || 'text';
  const placeholder = props.placeholder || label;

  return (
    <div className='form-field'>
      <label>{label}</label>
      <div>
        <select
          className='form-control'>
          value={value}
          onChange={(evt) => props.onChange(evt.target.value)}>
          {options.map(opt =>
            <option value={opt.value}>{opt.label}</option>
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
        cost: task.get('cost')
      };
      this.state.isEdit = true;
    };
  }

  handleChange(field, val) {
    this.setState({[field]: val});
  }

  render() {
    const projects = [
      {value: 1, label: 'UMS'},
      {value: 2, label: 'IndustryHub'},
    ];
    return (
      <div className='panel'>
        <div className='panel-body'>
          <div className='form-row'>
            <TextField
              onChange={(val) => this.handleChange('name', val)}
              label='Task Name' />
            <SelectField
              onChange={(val) => this.handleChange('project', val)}
              options={projects}
              label='Project' />
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, { params }) => {
  return {
  };
};

const actions = {
  ...taskActions
};

const TaskFormContainer = connect(mapStateToProps, actions)(TaskForm);
export {TaskFormContainer};
