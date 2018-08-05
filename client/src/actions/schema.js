'use strict';
import { Schema, arrayOf } from 'normalizr';

export const project = new Schema('projects');
export const projects = arrayOf(project);

export const invoice = new Schema('invoices');
export const invoices = arrayOf(invoice);

invoice.define({
  project: project,
  projects: projects
});

timeslip.define({
  project: project,
  projects: projects
});

