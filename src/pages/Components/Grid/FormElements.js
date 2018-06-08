import React from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../components/FormInputs/renderField';
import DatePicker from '../../Forms/ExtendedForms/DatePicker.js';

const FormElements = () => (
  <div className="card">
    <div className="header">
      <h4>Project Details</h4>
    </div>
    <div className="content">
      <form className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-3">Start Date (initial planning)</label>
          <div className="col-md-9">
            <DatePicker />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-3">Start Date (revised)</label>
          <div className="col-md-9">
            <DatePicker />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-3">End Date (initial planning)</label>
          <div className="col-md-9">
            <DatePicker />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-md-3">End Date (revised)</label>
          <div className="col-md-9">
            <DatePicker />
          </div>
        </div>
      </form>

      <div className="buttons-with-margin text-center">
        <button type="button" className="btn btn-wd btn-success">
          <span className="btn-label">
            <i className="fa fa-check"></i>
          </span> Close Project
        </button>
      </div>
    </div>
  </div>
);

export default reduxForm({
  form: 'formElements'
})(FormElements);
