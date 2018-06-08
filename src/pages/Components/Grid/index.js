import React, { Component } from 'react';
import ProjectSearch from './ProjectSearch';

const ButtonsPage = () => (

    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <ProjectSearch initialValues={{
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

export default ButtonsPage;
