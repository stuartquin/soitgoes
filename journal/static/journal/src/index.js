'use strict';
// http://boooya.aqvatarius.com/pages-payment-invoice.html

import React from 'react';
import ReacDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute, IndexRedirect} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import {Provider} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import constants from './constants';
import configureStore from './configureStore';
import { App } from './app';
import { TimeslipsContainer} from './components/timeslips/timeslipcontainer';
import NavContainer from './components/nav/navcontainer';
import { InvoicesContainer } from './components/invoices/invoicescontainer';
import { InvoiceContainer } from './components/invoices/invoicecontainer';
import { ProjectsContainer } from './components/projects/projectscontainer';
import { ProjectContainer } from './components/projects/projectcontainer';
import { DashContainer } from './components/dash/dash';
import { TasksContainer } from './components/tasks/taskscontainer';
import { TaskContainer } from './components/tasks/taskcontainer';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

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
      <Route path='projects'>
        <IndexRoute component={ProjectsContainer}/>
        <Route path=':id' component={ProjectContainer}/>
      </Route>
      <Route path='timeslips' component={TimeslipsContainer} />
      <Route path='dash' component={DashContainer} />
      <Route path='tasks'>
        <IndexRoute component={TasksContainer}/>
        <Route path=':id' component={TaskContainer}/>
      </Route>
    </Route>
    <IndexRoute component={NavContainer}/>
    <IndexRedirect to='/dash' />
  </Route>
);

ReacDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
        {routes}
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
