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
import Project from './Project/index.js';

class SearchProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCountry: {},
      selectedClient: {},
      selectedApprover: {},
      selectedProject: {},
      projectValue: "",
      country: [],
      client: [],
      approver: [],
      project: [],
      projects: [],
      projectData: {},
      viewingProject: {}
    }
    this.updateSelectedCountry = this.updateSelectedCountry.bind(this);
    this.updateSelectedClient = this.updateSelectedClient.bind(this);
    this.updateSelectedApprover = this.updateSelectedApprover.bind(this);
    this.updateSelectedProject = this.updateSelectedProject.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
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
        console.log(body);
      });
  }

	updateSelectedCountry (newValue) {
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
        console.log(body);
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

  ProjectList() {
    $.getJSON('https://6gric70tv3.execute-api.eu-central-1.amazonaws.com/stage_porject_name_list')
      .then(({ body }) => {
        this.setState({ project: body });
      });
  }

	updateSelectedProject (newValue) {
		this.setState({
			selectedProject: newValue
		});
	}

  handleChange(event) {
    this.setState({projectValue: event.target.value});
  }

  search(values) {
    this.setState({viewingProject: {}, projects: []})

    let data = {
      country_id: (this.state.selectedCountry || {}).country_id,
      customer_id: (this.state.selectedClient || {}).customer_id,
      emp_id: (this.state.selectedApprover || {}).emp_id,
      title: (this.state.selectedProject || {}).title
    }
    let self = this;
    console.log('submitting', data)
    $.post('https://hdg9ozgz6i.execute-api.eu-central-1.amazonaws.com/stage_search_porject',
      JSON.stringify(data),
      (function(data) {
        console.log(data);
        this.setState({projects: data.body})
      }).bind(this),
      "json");
  }

  viewProject(proj_code) {
    let data = {proj_code}
    console.log('submitting', data)
    $.post('https://4pg391re42.execute-api.eu-central-1.amazonaws.com/stage_getactiveproject',
      JSON.stringify(data),
      (function(data) {
        console.log(data);
        data = data || {}
        this.setState({viewingProject: data.body[0]})
      }).bind(this),
      "json");
  }

  render() {
    return (
      <div>
        <div className="header text-center">
          <p className='heading'>Search Projects</p>
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
                          <VirtualizedSelect ref="projectSelect"
                          options={this.state.project}
                          name="select-approver"
                          value={this.state.selectedProject}
                          onChange={this.updateSelectedProject}
                          searchable
                          labelKey="title"
                          valueKey="title"
                          />
                      </div>
                  </section>
                </div>
              </div>
            </div>
          </form>

          <div className="text-center">
            <button type="button" onClick={this.search} className="margin-5 btn btn-rectangle btn-wd btn-info">
              <span className="btn-label">
              <i className="fa fa-search"></i>
              </span> Search
            </button>
          </div>
        </div>

        {this.state.projects.length && !this.state.viewingProject.id ?
          <div>
            <hr />
            <div className="header text-center">
              <p className='heading'>Matching Projects</p>
            </div>

            <div className="content table-responsive table-full-width">
              <table className="table table-hover zero-margin">
                <thead>
                  <tr>
                    <th>Project Code</th>
                    <th>Country</th>
                    <th>Client Name</th>
                    <th>Approver</th>
                    <th>Project Name</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.projects.map(project => (
                  <tr onClick={this.viewProject.bind(this, project.proj_code)} key={project.proj_code}>
                    <td>{project.proj_code}</td>
                    <td>{project.country}</td>
                    <td>{project.customer_name}</td>
                    <td>{project.employee_name}</td>
                    <td>{project.title}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        : null}

        {this.state.viewingProject.id ?
          <div>
            <hr />
            <Project project={this.state.viewingProject} country={this.state.country} client={this.state.client} user={this.props.user} />
          </div>
        : null}
      </div>
    )
  }
}

export default reduxForm({
  form: 'formElements'
})(SearchProject);
