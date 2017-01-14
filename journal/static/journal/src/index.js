'use strict';

import React from 'react';
import ReacDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute, IndexRedirect} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import {Provider} from 'react-redux';

import constants from './constants';
import configureStore from './configureStore';
import { App } from './app';
import { TimeslipsContainer} from './components/timeslips/timeslipcontainer';
import { NavContainer } from './components/nav/navcontainer';
import { InvoicesContainer } from './components/invoices/invoicescontainer';
import { InvoiceContainer } from './components/invoices/invoicecontainer';
import { ProjectsContainer } from './components/projects/projectscontainer';
import { DashContainer } from './components/dash/dash';
import { TasksContainer } from './components/tasks/taskscontainer';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch({
  type: constants.SET_STATE
});

const routes = (
  <Route path='/' component={App}>
    <Route component={NavContainer}>
      <Route path='invoices'>
        <IndexRoute component={InvoicesContainer}/>
        <Route path=':id' component={InvoiceContainer}/>
      </Route>
      <Route path='timeslips' component={TimeslipsContainer} />
      <Route path='dash' component={DashContainer} />
      <Route path='tasks' component={TasksContainer} />
    </Route>
    <IndexRoute component={NavContainer}/>
    <IndexRedirect to='/dash' />
  </Route>
);

ReacDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);
