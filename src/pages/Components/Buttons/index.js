import React, { Component } from 'react';
import CreateProject from './CreateProject';
import generateData from './generateData.js';
import PlainBackgroundTable from '../Details/PlainBackgroundTable';

const data = generateData(15);

const ButtonsPage = () => (

    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <CreateProject />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <PlainBackgroundTable data={data} />
        </div>
      </div>
    </div>
);

export default ButtonsPage;
