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

class Documents extends React.Component {
  constructor() {
    super();
    this.state = { clientMaster: [], consultantMaster: [], projectCodeMaster: [], chargeCode: [], calendar: [], tbd: [] }
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
            <form className="form-horizontal">
              <div className="content">

                <div className="form-group">
                  <label className="control-label col-md-3">Box Link</label>
                  <div className="col-md-6">
                    <Field
                      name="password"
                      type="text"
                      placeholder="Paste the link for Box Folder"
                      component={renderField} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-3 control-label">Case Study</label>
                  <div>
                    <div className='col-sm-6'>
                      <Dropzone className='dropzone' onDrop={this.onDrop.bind(this, 'clientMaster')}>
                      {
                        this.state.clientMaster.length ? this.state.clientMaster.map(f => <p className="uploaded-file" key={f.name}>{f.name} - {f.size} bytes</p>)
                        : <p className="upload-file">Upload file  <i className="fa fa-upload"></i></p>
                      }
                      </Dropzone>
                    </div>
                  </div>
                  <div>
                    {this.state.clientMaster.length ? <button onClick={this.removeFile.bind(this, 'clientMaster')} type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                      <i className="fa fa-times"></i>
                    </button> : null}
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-3 control-label">Sample Deliverable 1</label>
                  <div>
                    <div className='col-sm-6'>
                      <Dropzone className='dropzone' onDrop={this.onDrop.bind(this, 'consultantMaster')}>
                      {
                        this.state.consultantMaster.length ? this.state.consultantMaster.map(f => <p className="uploaded-file" key={f.name}>{f.name} - {f.size} bytes</p>)
                        : <p className="upload-file">Upload file  <i className="fa fa-upload"></i></p>
                      }
                      </Dropzone>
                    </div>
                  </div>
                  <div>
                  {this.state.consultantMaster.length ? <button onClick={this.removeFile.bind(this, 'consultantMaster')} type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                    <i className="fa fa-times"></i>
                  </button> : null}
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-3 control-label">Lessons Learned</label>
                  <div>
                    <div className='col-sm-6'>
                      <Dropzone className='dropzone' onDrop={this.onDrop.bind(this, "projectCodeMaster")}>
                      {
                        this.state.projectCodeMaster.length ? this.state.projectCodeMaster.map(f => <p className="uploaded-file" key={f.name}>{f.name} - {f.size} bytes</p>)
                        : <p className="upload-file">Upload file  <i className="fa fa-upload"></i></p>
                      }
                      </Dropzone>
                    </div>
                  </div>
                  <div>
                  {this.state.projectCodeMaster.length ? <button onClick={this.removeFile.bind(this, 'projectCodeMaster')} type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
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
                <button type="submit" className="btn btn-info btn-fill">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'Documents',
  validate
})(Documents);
