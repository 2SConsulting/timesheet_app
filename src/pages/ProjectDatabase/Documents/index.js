import React, { Component } from 'react';
import SearchDocuments from './SearchDocuments';
import MatchedDocuments from './MatchedDocuments'
import generateData from './generateData';

const data = generateData(15);

const Documents = () => (

    <div className="container-fluid header-margin">
      <div className="row">
        <div className="col-md-12">
          <SearchDocuments initialValues={{
            radioGroup: 'male',
            a: true,
            checked: true,
            disabledChecked: true,
            radioOnOff: 'on',
            radioDisabledOnOff: 'on'
          }} />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-12">
          <MatchedDocuments data={data} />
        </div>
      </div>
    </div>
);

export default Documents;
