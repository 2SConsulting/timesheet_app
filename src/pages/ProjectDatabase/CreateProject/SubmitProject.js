import React from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import renderField from '../../../components/FormInputs/renderField';
import Select from 'react-select';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import $ from 'jquery'
import swal from 'sweetalert';

import COUNTRY_LIST from './countryList.js';

class SubmitProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCountry: {},
      selectedClient: {},
      selectedApprover: {},
      projectValue: "",
      country: [],
      client: [],
      approver: [],
      projects: [],
      button: 'disabled'
    }
    this.updateSelectedCountry = this.updateSelectedCountry.bind(this);
    this.updateSelectedClient = this.updateSelectedClient.bind(this);
    this.updateSelectedApprover = this.updateSelectedApprover.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.CountryList();
    // this.ClientList();
    this.ApproverList();
    this.ProjectList();
  }

  CountryList() {
    $.getJSON('https://t4gu5o81fc.execute-api.eu-central-1.amazonaws.com/country_list')
      .then(({ body }) => {
        this.setState({ country: body });
      });
  }

	updateSelectedCountry (newValue) {
    console.log(newValue)
    newValue = newValue || {};
    this.ClientList(newValue.country_id);
		this.setState({
			selectedCountry: newValue
		});
	}

  ClientList(selectedCountryId) {
    $.getJSON('https://6g55lhr2v5.execute-api.eu-central-1.amazonaws.com/stage_customer_list?country_id=' + selectedCountryId)
      .then(({ body }) => {
        this.setState({ client: body });
      });
  }

	updateSelectedClient (newValue) {
		this.setState({
			selectedClient: newValue
		});
	}

  ApproverList() {
    $.getJSON('https://qxuz4wter3.execute-api.eu-central-1.amazonaws.com/stage_employee_list')
      .then(({ body }) => {
        console.log('approver', body)
        this.setState({ approver: body });
      });
  }

	updateSelectedApprover (newValue) {
		this.setState({
			selectedApprover: newValue
		});
	}

  handleChange(event) {
    this.setState({projectValue: event.target.value});
  }

  onSubmit(values) {
    this.setState({button: 'loading'});
    let data = {
      country_id: this.state.selectedCountry.country_id,
      customer_id: this.state.selectedClient.customer_id,
      emp_id: this.state.selectedApprover.emp_id,
      title: this.state.projectValue
    }
    console.log('submitting', data);
    $.post('https://l47of8gjx4.execute-api.eu-central-1.amazonaws.com/stages_submit_project',
      JSON.stringify(data),
      (function(data) {
        console.log(data);
        swal("Submitted Successfully", "", "success")
        this.setState({selectedCountry: {}, selectedClient: {}, selectedApprover: {}, projectValue: "", button: 'disabled'});
        this.ProjectList();
      }).bind(this),
      "json");
  }

  ProjectList() {
    $.getJSON('https://97h10a54x9.execute-api.eu-central-1.amazonaws.com/stage_project_list')
      .then(({ body }) => {
        this.setState({ projects: body });
      });
  }

//Initiate,Ongoing,On Hold,Canceled
//To Be Approved | Not approved | Approved
  updateStatus() {
    swal({
      title: 'Update Status'
    })
  }

  render() {
    return (
      <div>
        <div className="header text-center">
          <p className='heading'>Create Project</p>
        </div>
        <div className="content">
          <form className="form-horizontal">
            <div className="row">

              <div className="col-md-6">
                <div className="float-right">

                  <div className="form-group">
                    <section className="flex-center">
                      <label className="control-label width-100 left-align hmargin-10">Country</label>
                        <div className="width-200 height-30 section">
                            <VirtualizedSelect ref="countrySelect"
                              options={this.state.country}
                              clearable
                              name="select-country"
                              value={this.state.selectedCountry}
                              onChange={this.updateSelectedCountry}
                              searchable
                              labelKey="country"
                              valueKey="country_id"
                            />
                  			</div>
                    </section>
                  </div>

                  <div className="form-group">
                    <section className="flex-center">
                      <label className="control-label width-100 left-align hmargin-10">Client Name</label>
                        <div className="width-200 height-30 section">
                            <VirtualizedSelect ref="clientSelect"
                              options={this.state.client}
                              clearable
                              name="select-client"
                              value={this.state.selectedClient}
                              onChange={this.updateSelectedClient}
                              searchable
                              labelKey="name"
                              valueKey="customer_id"
                            />
                  			</div>
                    </section>
                  </div>

                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <section className="flex-center">
                    <label className="control-label width-100 left-align hmargin-10">Approver</label>
                      <div className="width-200 height-30 section">
                          <VirtualizedSelect ref="approverSelect"
                          options={this.state.approver}
                          clearable
                          name="select-approver"
                          value={this.state.selectedApprover}
                          onChange={this.updateSelectedApprover}
                          searchable
                          labelKey="name"
                          valueKey="emp_id"
                          />
                			</div>
                  </section>
                </div>

                <div className="form-group">
                  <section className="flex-center">
                    <label className="control-label width-100 left-align hmargin-10">Project Name</label>
                      <div className="width-200 height-30 section">
                          <input type="text" placeholder="Sample Project" className="form-control" value={this.state.projectValue} onChange={this.handleChange} />
                			</div>
                  </section>
                </div>
              </div>
            </div>
          </form>

          <div className="text-center">
            {
              this.state.button == 'loading' ?
                <button key="loading" type="button" className="margin-5 btn-loading btn-loading btn btn-rectangle btn-wd btn-info">
                  <span className="btn-label">
                  <i className="fa fa-spinner"></i>
                  </span> Submit
                </button>
            : this.state.selectedCountry && this.state.selectedClient && this.state.selectedApprover && this.state.projectValue ?
                <button key="active" type="button" onClick={this.onSubmit} className="margin-5 btn-active btn btn-rectangle btn-wd btn-info">
                  <span className="btn-label">
                  <i className="fa fa-plus-square"></i>
                  </span> Submit
                </button>
            :
                <button key="disabled" type="button" className="margin-5 btn-disabled btn btn-rectangle btn-wd">
                  <span className="btn-label">
                  <i className="fa fa-plus-square"></i>
                  </span> Submit
                </button>
            }
          </div>
        </div>

        <hr />

        <div>
          <div className="header text-center">
            <p className='heading'>Existing Projects</p>
          </div>

          <div className="content table-responsive table-full-width">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Project Code</th>
                  <th>Country</th>
                  <th>Client Name</th>
                  <th>Approver</th>
                  <th>Project Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              {this.state.projects.map(project => (
                <tr key={project.proj_code}>
                  <td>{project.proj_code}</td>
                  <td>{project.country}</td>
                  <td>{project.customer_name}</td>
                  <td>{project.employee_name}</td>
                  <td>{project.title}</td>
                  <td>{project.proj_status ? project.proj_status : 'Pending'}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'formElements'
})(SubmitProject);
