'use strict';
// http://boooya.aqvatarius.com/pages-payment-invoice.html

import React from 'react';
import ReacDOM from 'react-dom';

import { Route, IndexRoute, IndexRedirect } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createHistory from 'history/createBrowserHistory'

import constants from './constants';
import configureStore from './configureStore';

import { AppContainer } from './app';
import { TimeslipsContainer} from './components/timeslips/timeslipcontainer';
import { InvoicesContainer } from './components/invoices/invoicescontainer';
import { InvoiceContainer } from './components/invoices/invoicecontainer';
import { ProjectsContainer } from './components/projects/projectscontainer';
import { ProjectContainer } from './components/projects/projectcontainer';
import { DashContainer } from './components/dash/dash';
import { TasksContainer } from './components/tasks/taskscontainer';
import { TaskContainer } from './components/tasks/taskcontainer';
import { ContactsContainer } from './components/contact/contactscontainer';
import { ContactContainer } from './components/contact/contactcontainer';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const history = createHistory();
const store = configureStore(history);

store.dispatch({
  type: constants.SET_STATE
});

ReacDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <ConnectedRouter history={history} onUpdate={() => window.scrollTo(0, 0)}>
        <Route path='/' component={AppContainer} />
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
