import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Dialog from 'components/Dialog';
import { Input, Select, FormRow, Label } from 'components/Form';
import { Grid, Cell } from 'components/Grid';
import { Divider, Button } from 'components/GUI';
import { saveTask } from 'services/task';
import useForm from 'services/useForm';

const STATUS_OPTIONS = [
  ['OPEN', 'Open'],
  ['PROGRESS', 'In Progress'],
  ['DONE', 'Complete'],
];

const BILLING_TYPE_OPTIONS = [['TIME', 'Time'], ['FIXED', 'Fixed Cost']];

const formatDate = date => {
  return date ? new Date(date).toISOString() : null;
};

const Task = ({ task, projects, selectedProject, onCancel, onSave }) => {
  const { values, handleChange } = useForm({
    billing_type: 'TIME',
    project: selectedProject,
    ...task,
  });
  const action = task.id ? 'Edit' : 'Add';

  const handleSave = async () => {
    await saveTask({
      ...values,
      completed_at: formatDate(values.completed_at),
      project: values.project.id ? values.project.id : values.project,
    });
    onSave();
  };
  const activeProject = values.project || {};
  const cost = values.cost || activeProject.cost || '';

  return (
    <Dialog
      title={`${action} Task`}
      onClose={onCancel}
      actions={[
        <Button key={1} type="submit" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <form onSubmit={handleSave}>
        <FormRow>
          <Grid>
            <Cell xs={8}>
              <Label>Name</Label>
              <Input
                onChange={handleChange}
                name="name"
                value={values.name || ''}
              />
            </Cell>
            <Cell xs={4}>
              <Label>Status</Label>
              <Select
                onChange={handleChange}
                name="state"
                value={values.state || ''}
              >
                {STATUS_OPTIONS.map(([state, title]) => (
                  <option key={state} value={state}>
                    {title}
                  </option>
                ))}
              </Select>
            </Cell>
          </Grid>
        </FormRow>

        <FormRow>
          <Grid>
            <Cell xs={8}>
              <Label>Project</Label>
              <Select
                onChange={handleChange}
                name="project"
                value={values.project ? values.project.id : ''}
              >
                <option value={''} disabled>
                  Choose Project
                </option>
                {projects.map(project => (
                  <option value={project.id}>{project.name}</option>
                ))}
              </Select>
            </Cell>
          </Grid>
        </FormRow>

        <Divider />

        <FormRow>
          <Grid>
            <Cell xs={6} sm={4}>
              <Label>Billing Type</Label>
              <Select
                onChange={handleChange}
                name="billing_type"
                value={values.billing_type || BILLING_TYPE_OPTIONS[0][0]}
              >
                {BILLING_TYPE_OPTIONS.map(([type, title]) => (
                  <option key={type} value={type}>
                    {title}
                  </option>
                ))}
              </Select>
            </Cell>
            {values.billing_type === 'TIME' && (
              <Cell xs={6} sm={4}>
                <Label>Estimated Hours</Label>
                <Input
                  type="number"
                  name="hours_predicted"
                  value={values.hours_predicted || ''}
                  onChange={handleChange}
                />
              </Cell>
            )}
            {values.billing_type === 'FIXED' && (
              <Cell xs={6} sm={4}>
                <Label>Cost</Label>
                <Input
                  type="number"
                  name="cost"
                  value={cost}
                  onChange={handleChange}
                />
              </Cell>
            )}
          </Grid>
        </FormRow>

        <FormRow>
          <Grid>
            <Cell xs={6} sm={4}>
              <Label>Due Date</Label>
              <Input
                type="date"
                name="due_date"
                value={values.due_date || ''}
                onChange={handleChange}
              />
            </Cell>
            <Cell xs={6} sm={4}>
              <Label>Completed Date</Label>
              <Input
                type="date"
                name="completed_at"
                value={values.completed_at || ''}
                onChange={handleChange}
              />
            </Cell>
          </Grid>
        </FormRow>
      </form>
    </Dialog>
  );
};

const mapStateToProps = state => {
  return {
    projects: Object.values(state.project.items).filter(p => !p.archived),
  };
};

export default connect(
  mapStateToProps,
  {}
)(Task);
