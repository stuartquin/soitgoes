'use strict';
import { Schema, arrayOf } from 'normalizr';

export const timeslip = new Schema('timeslips');
export const timeslips = arrayOf(timeslip);
export const project = new Schema('projects');
export const projects = arrayOf(project);

timeslip.define({
  project: project,
  projects: projects
});

