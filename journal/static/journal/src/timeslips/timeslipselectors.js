import { createSelector } from 'reselect'

const getTimeslips = (state) => state.timeslips.get('items');
const getProjects = (state) => state.reducer.get('projects');

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
