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

class ExtendedForm extends React.Component {
  constructor() {
    super();
    this.state = { billingData: [], budgetData: [], tbd: [] }
  }

  onDrop(id, files) {
    this.setState({
      [id]: files
    });
  }

  removeFile(id, files) {
    this.setState({
      [id]: []
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="text-center header"><h4>Data Upload For SAP</h4></div>
            <form className="form-horizontal">
              <div className="content">
                <div className="form-group">
                  <label className="col-sm-3 control-label">Billing Data</label>
                  <div>
                    <div className='col-sm-6'>
                      <Dropzone className='dropzone' onDrop={this.onDrop.bind(this, 'billingData')}>
                      {
                        this.state.billingData.length ? this.state.billingData.map(f => <p className="uploaded-file" key={f.name}>{f.name} - {f.size} bytes</p>)
                        : <p className="upload-file">Upload file  <i className="fa fa-upload"></i></p>
                      }
                      </Dropzone>
                    </div>
                  </div>
                  <div>
                    {this.state.billingData.length ? <button onClick={this.removeFile.bind(this, 'billingData')} type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                      <i className="fa fa-times"></i>
                    </button> : null}
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-3 control-label">Budget Data</label>
                  <div>
                    <div className='col-sm-6'>
                      <Dropzone className='dropzone' onDrop={this.onDrop.bind(this, 'budgetData')}>
                      {
                        this.state.budgetData.length ? this.state.budgetData.map(f => <p className="uploaded-file" key={f.name}>{f.name} - {f.size} bytes</p>)
                        : <p className="upload-file">Upload file  <i className="fa fa-upload"></i></p>
                      }
                      </Dropzone>
                    </div>
                  </div>
                  <div>
                  {this.state.budgetData.length ? <button onClick={this.removeFile.bind(this, 'budgetData')} type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                    <i className="fa fa-times"></i>
                  </button> : null}
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label">TBD</label>
                   <div>
                      <div className='col-sm-6'>
                        <Dropzone className='dropzone' onDrop={this.onDrop.bind(this, "tbd")}>
                        {
                          this.state.tbd.length ? this.state.tbd.map(f => <p className="uploaded-file" key={f.name}>{f.name} - {f.size} bytes</p>)
                          : <p className="upload-file">Upload file  <i className="fa fa-upload"></i></p>
                        }
                        </Dropzone>
                      </div>
                    </div>
                    <div>
                      {this.state.tbd.length ? <button onClick={this.removeFile.bind(this, 'tbd')} type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                        <i className="fa fa-times"></i>
                      </button> : null}
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
  form: 'extendedForm',
  validate
})(ExtendedForm);
