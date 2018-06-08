import React from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../../components/FormInputs/renderField';
import MatchedProjects from './MatchedProjects';
import BigTable from './BigTable';

import generateData from './generateData.js';

const data = generateData(5);

const FormElements = () => (
  <div className="card">
    <div className="content">
      <div className="header text-center">
        <h4>Search Projects</h4>
      </div>
      <form className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-3">Country</label>
          <div className="col-md-6">
            <Field
              name="withHelp"
              type="text"
              component={renderField}
              placeholder="India"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-3">Client Name</label>
          <div className="col-md-6">
            <Field
              name="password"
              type="text"
              placeholder="Sample Client 1"
              component={renderField} />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-3">Project Name</label>
          <div className="col-md-6">
            <Field
              name="placeholder"
              type="text"
              placeholder="Sample Project 1"
              component={renderField} />
          </div>
        </div>
      </form>

      <div className='buttons-with-margin text-center'>
        <button type="button" className="btn btn-wd btn-info">
          Search
        </button>
      </div>

      <div className="row">
        <div className="col-md-12">
          <BigTable />
        </div>
      </div>
    </div>
  </div>
);

export default reduxForm({
  form: 'formElements'
})(FormElements);
