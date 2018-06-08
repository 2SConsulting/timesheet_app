import React, { Component } from 'react';
import SearchProjects from './SearchProjects';
//import MatchedProjects from './MatchedProjects';

import generateData from './generateData.js';

const data = generateData(5);

const ProjectDetails = ({openProject, user}) => (

    <div className="container-fluid header-margin">
      <div className="row">
        <div className="col-md-12">
          <SearchProjects user={user} initialValues={{
            radioGroup: 'male',
            a: true,
            checked: true,
            disabledChecked: true,
            radioOnOff: 'on',
            radioDisabledOnOff: 'on'
          }} />
        </div>
      </div>
    </div>
);

export default ProjectDetails;
