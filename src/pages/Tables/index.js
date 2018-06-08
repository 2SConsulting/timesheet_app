import React from 'react';
import { Route } from 'react-router-dom';
import RegularTables from './RegularTables';
import ExtendedTables from './ExtendedTables';
import ReactTable from './ReactTable';

import ReactBootstrapTable from './ReactBootstrapTable';

const Tables = ({match}) => (
  <div className="content">

    <Route path={`${match.url}/react-table`} component={ReactTable} />
    <Route path={`${match.url}/extended-tables`} component={ExtendedTables} />
    <Route path={`${match.url}/react-bootstrap-table`} component={ReactBootstrapTable} />
  </div>
);

export default Tables;
