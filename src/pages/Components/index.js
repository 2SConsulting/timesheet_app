import React from 'react';
import { Route } from 'react-router-dom';
import Buttons from './Buttons';
import Grid from './Grid';
import Details from './Details';
import SearchDocs from './SearchDocs';
import Notifications from './Notifications';
import Panels from './Panels';
import SweetAlert from './SweetAlert';
import Typography from './Typography';

const Components = ({match}) => (
  <div className="content">
    <Route path={`${match.url}/buttons`} component={Buttons} />
    <Route path={`${match.url}/grid`} component={Grid} />
    <Route path={`${match.url}/details`} component={Details} />
    <Route path={`${match.url}/search-docs`} component={SearchDocs} />
    <Route path={`${match.url}/notifications`} component={Notifications} />
    <Route path={`${match.url}/panels`} component={Panels} />
    <Route path={`${match.url}/sweetalert`} component={SweetAlert} />
    <Route path={`${match.url}/typography`} component={Typography} />
  </div>
);

export default Components;
