'use strict';
import { Schema, arrayOf } from 'normalizr';

export const timeslip = new Schema('timeslips');
export const project = new Schema('projects');

timeslip.define({
  project: project,
  projects: arrayOf(project)
});

export const timeslips = arrayOf(timeslip);
