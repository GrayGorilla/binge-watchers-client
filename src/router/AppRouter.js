import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import NavBar from '../components/shared-components/NavBar';
import Homepage from '../components/Homepage';
import Search from '../components/Search';
import Analysis from '../components/Analysis';

export const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <NavBar />
    <Switch>
      <Route 
        path="/"
        component={Homepage}
        title="Home Page"
        exact={true}
      />
      <Route
        path="/search"
        component={Search}
        title="Search"
      />
      <Route
        path="/analysis"
        component={Analysis}
        title="Analysis"
      />
    </Switch>
  </Router>
);

export default AppRouter;
