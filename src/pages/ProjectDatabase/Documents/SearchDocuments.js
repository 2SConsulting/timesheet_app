import React from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../../components/FormInputs/renderField';
import MatchedDocuments from './MatchedDocuments';

import generateData from './generateData.js';

const data = generateData(5);
const SearchDocuments = () => (
  <div>
    <div className="header text-center">
      <p className='heading margin-10'>Search Documents</p>
    </div>
    <div className="content">
      <form className="form-horizontal">
        <div className="row">
          <div className="col-md-6">
            <div className="float-right">
            <div className="form-group">
              <section className="flex-center">
                <label className="control-label width-100 left-align hmargin-10">Country</label>
                <Field
                  name="withHelp"
                  type="text"
                  component={renderField}
                  placeholder="India"
                />
              </section>
            </div>
            <div className="form-group">
              <section className="flex-center">
                <label className="control-label width-100 left-align hmargin-10">Client Name</label>
                <Field
                    name="password"
                    type="text"
                    placeholder="Sample Client 1"
                    component={renderField} />
              </section>
            </div>
            <div className="form-group">
              <section className="flex-center">
                <label className="control-label width-100 left-align hmargin-10">Project Name</label>
                  <Field
                    name="placeholder"
                    type="text"
                    placeholder="Sample Project 1"
                    component={renderField} />
              </section>
            </div>
            <div className="form-group">
              <section className="flex-center">
                <label className="control-label width-100 left-align hmargin-10">Approver</label>
                  <Field
                    name="placeholder"
                    type="text"
                    placeholder="Approver name"
                    component={renderField} />
              </section>
            </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <section className="flex-center">
                <label className="control-label width-100 left-align hmargin-10">IHS Service Line</label>
                  <Field
                    name="placeholder"
                    type="text"
                    placeholder="IHS Service Line"
                    component={renderField} />
              </section>
            </div>

            <div className="form-group">
              <section className="flex-center">
                <label className="control-label width-100 left-align hmargin-10">Speciality</label>
                  <Field
                    name="placeholder"
                    type="text"
                    placeholder="Speciality"
                    component={renderField} />
              </section>
            </div>

            <div className="form-group">
              <section className="flex-center">
                <label className="control-label width-100 left-align hmargin-10">Department</label>
                  <Field
                    name="placeholder"
                    type="text"
                    placeholder="Department"
                    component={renderField} />
              </section>
            </div>

            <div className="form-group">
              <section className="flex-center">
                <label className="control-label width-100 left-align hmargin-10">Search Term</label>
                  <Field
                    name="placeholder"
                    type="text"
                    placeholder="Search Term"
                    component={renderField} />
              </section>
            </div>
          </div>

        </div>
      </form>

      <div className="text-center">
        <button type="button" className="margin-5 btn btn-rectangle btn-wd btn-info">
          <span className="btn-label">
          <i className="fa fa-search"></i>
          </span> Submit
        </button>
      </div>
    </div>
  </div>
);

export default reduxForm({
  form: 'SearchDocuments'
})(SearchDocuments);
