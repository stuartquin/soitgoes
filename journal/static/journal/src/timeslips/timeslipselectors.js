'use strict';
import { createSelector } from 'reselect';

export const getProjects = (state) => state.projects.get('items');
export const getTimeslips = (state) => state.timeslips.get('items');

export const getProjectsWithTimeslips = createSelector(
  [getTimeslips, getProjects],
  (timeslips, projects) => {
    return projects.map((p) => {
      return p.set('timeslips', timeslips.filter((t) => {
        return t.get('project') === p.get('id');
      }));
    });
  }
);
