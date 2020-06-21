import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';

import { NavContainer } from 'components/nav/navcontainer';
import { theme } from 'components/GUI';

const App = () => (
  <ThemeProvider theme={theme}>
    <Route component={NavContainer} />
  </ThemeProvider>
);

export default hot(App);
