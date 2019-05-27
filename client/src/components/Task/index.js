import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import Dialog from 'components/Dialog';
import {Input, Select, FormRow, Label} from 'components/Form';
import {Grid, Cell} from 'components/Grid';
import {Divider, Button} from 'components/GUI';
import useForm from 'services/useForm';

const Task = ({task, projects, onCancel}) => {
  const { values, handleChange } = useForm({ ...task });
  const action = task ? 'Edit' : 'Add'

  return (
    <Dialog
      title={`${action} Task`}
      onClose={onCancel}
      actions={[
        <Button key={0}>Cancel</Button>,
        <Button key={1} type="success">Save</Button>,
      ]}
    >
      <form>
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
              <Input
                onChange={handleChange}
                name="name"
                value="Open"
              />
            </Cell>
          </Grid>
        </FormRow>


        <FormRow>
          <Grid>
            <Cell xs={8}>
              <Label>Project</Label>
              <Select onChange={handleChange} name="project">
                {projects.map(project => (
                  <option value={project.id}>{project.name}</option>
                ))}
              </Select>
            </Cell>
            <Cell xs={4}>
              <Label>Cost</Label>
              <Input
                type="number"
                name="cost"
                value={values.cost || ''}
                onChange={handleChange}
              />
            </Cell>
          </Grid>
        </FormRow>

        <Divider />

        <FormRow>
          <Grid>
            <Cell xs={6} sm={4}>
              <Label>Estimated Hours</Label>
              <Input
                type="number"
                name="hours_predicted"
                value={values.hours_predicted || ''}
                onChange={handleChange}
              />
            </Cell>
            <Cell xs={6} sm={4}>
              <Label>Actual Hours</Label>
              <Input
                type="number"
                name="hours_spent"
                value={values.hours_spent || ''}
                onChange={handleChange}
              />
            </Cell>
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

const mapStateToProps = (state) => {
  return {
    projects: Object.values(state.project.items),
  };
};

const actions = {
};

export default connect(mapStateToProps, actions)(Task);
