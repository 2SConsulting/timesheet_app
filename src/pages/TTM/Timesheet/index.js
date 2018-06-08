import React, { Component } from 'react';
import Timesheet from './Timesheet';

const CreateProject = (user) => (

    <div className="container-fluid header-margin">
      <div className="row">
        <div className="col-md-12">
          <Timesheet user={user}/>
        </div>
      </div>
    </div>
);

export default CreateProject;
