import React, { Component } from 'react';
import SubmitProject from './SubmitProject';
import generateData from './generateData.js';
import SubmittedProjects from './SubmittedProjects';

const data = generateData(15);

const CreateProject = () => (

    <div className="container-fluid header-margin">
      <div className="row">
        <div className="col-md-12">
          <SubmitProject />
        </div>
      </div>
    </div>
);

export default CreateProject;
