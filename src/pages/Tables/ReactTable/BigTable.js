import React from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../../components/FormInputs/renderField';
import _ from 'lodash';
import Dropzone from 'react-dropzone'

const validate = values => {
  const errors = {};
  if (!values.required) {
    errors.required = 'This field is required';
  }
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }
  if (values.number && _.isNaN(values.number)) {
    errors.number = 'Please enter a number';
  }
  if (values.url && !/^https?:\/\//i.test(values.url)) {
    errors.url = 'Please enter a valid URL';
  }
  if (values.equal1 && values.equal1 !== values.equal2) {
    errors.equal2 = 'Does not match';
  }
  return errors;
}

class ValidationForm extends React.Component {
  constructor() {
    super();
    this.state = { files: [] }
  }

  onDrop(files) {
    this.setState({
      files
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="text-center header"><h4>Manage Control Data</h4></div>
            <form className="form-horizontal">
              <div className="content">
                <div className="form-group">
                  <label className="col-sm-3 control-label">Time Data</label>
                  <div>
                    <div className='col-sm-6'>
                      <Dropzone className='dropzone' onDrop={this.onDrop.bind(this)}>
                        <p className="upload-file">Upload file</p>
                      </Dropzone>
                      {
                        this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                      }
                    </div>
                  </div>
                  <div>
                    <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-info btn-simple btn-icon" data-original-title="View Post">
                      <i className="fa fa-image"></i>
                    </button>
                    <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-success btn-simple btn-icon" data-original-title="Edit Post">
                      <i className="fa fa-edit"></i>
                    </button>
                    <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-3 control-label">Project Master</label>
                  <div>
                    <div className='col-sm-6'>
                      <Dropzone className='dropzone' onDrop={this.onDrop.bind(this)}>
                        <p className="upload-file">Upload file</p>
                      </Dropzone>
                      {
                        this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                      }
                    </div>
                  </div>
                  <div>

                    <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-info btn-simple btn-icon" data-original-title="View Post">
                      <i className="fa fa-image"></i>
                    </button>
                    <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-success btn-simple btn-icon" data-original-title="Edit Post">
                      <i className="fa fa-edit"></i>
                    </button>
                    <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-3 control-label">TBD</label>
                   <div>
                      <div className='col-sm-6'>
                        <Dropzone className='dropzone' onDrop={this.onDrop.bind(this)}>
                          <p className="upload-file">Upload file</p>
                        </Dropzone>
                        {
                          this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                        }
                      </div>
                    </div>
                    <div>
                      <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-info btn-simple btn-icon" data-original-title="View Post">
                        <i className="fa fa-image"></i>
                      </button>
                      <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-success btn-simple btn-icon" data-original-title="Edit Post">
                        <i className="fa fa-edit"></i>
                      </button>
                      <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                </div>
              </div>
              <div className="footer text-center margin-bottom-20">
              <button type="button" className="btn btn-rectangle btn-wd btn-info">
                <span className="btn-label">
                </span> Submit
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'validationForm',
  validate
})(ValidationForm);
