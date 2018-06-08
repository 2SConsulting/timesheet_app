import React, { Component } from 'react';
import ManageSubmissions from './ManageSubmissions';

const CreateProject = (user) => (

    <div className="container-fluid header-margin">
      <div className="row">
        <div className="col-md-12">
          <ManageSubmissions user={user} />
        </div>
      </div>
    </div>
);

export default CreateProject;
