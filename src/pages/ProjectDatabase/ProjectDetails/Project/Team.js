import React from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../../../components/FormInputs/renderField';
import DatePicker from '../../../../components/DateTime/DatePicker.js';
import $ from 'jquery'
import VirtualizedSelect from 'react-virtualized-select';
import swal from 'sweetalert';

class Team extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: [],
      value: '',
      employees: [],
      edit: false,
      initialTeam: []
    }

    this.updateSelectedEmployee = this.updateSelectedEmployee.bind(this);
  }

  componentDidMount() {
    this.TeamList();
    this.EmployeesList();
  }

  EmployeesList() {
    $.getJSON('https://qxuz4wter3.execute-api.eu-central-1.amazonaws.com/stage_employee_list')
      .then(({ body }) => {
        this.setState({ employees: body });
      });
  }

  TeamList() {
    let data = {
      proj_code: this.props.projectCode
    }

    console.log(data, 'team list')
    $.post('https://jsuvtelhgi.execute-api.eu-central-1.amazonaws.com/stage_projectteamlist',
      JSON.stringify(data),
      (function(res) {
        console.log('team list', res)
        this.setState({team: res.body, initialTeam: res.body})
      }).bind(this),
      "json");
  }

  updateSelectedEmployee (newValue) {
    newValue = newValue || {};

    let team = this.state.team;
    for (var i = 0; i < team.length; i++) {
      if (team[i].emp_id == newValue.emp_id)
        return;
    }
    team.unshift(newValue);
    this.setState({team});
	}

  cancel() {
    let team = this.state.initialTeam;
    this.setState({edit: false, team });
  }

  remove(index) {
    let team = this.state.team;
    team.splice(index, 1);
    this.setState({team})
  }

  save() {
    this.setState({edit: false});

    let employees = [];
    for (var i =0; i<this.state.team.length; i++)
      employees.push(this.state.team[i].emp_id);

    let data = {
      proj_code: this.props.projectCode,
      emp_id: employees
    }
    console.log(data)

    $.post('https://gi5kl9w5gc.execute-api.eu-central-1.amazonaws.com/stage_save_project_team',
      JSON.stringify(data),
      (function(res) {
        console.log(res);
        this.setState({edit: false});
      }).bind(this),
      "json");
  }

  render() {
    return (
      <div>
        {this.state.edit ?
        <span>
          <span className="width-500 valign height-53 bold">Add Team Member</span>
          <span className="width-500 valign height-53">
            <div className="vmargin-15 width-185 valign">
              <VirtualizedSelect ref="countrySelect"
                options={this.state.employees}
                clearable
                name="select-country"
                value={this.state.selectedEmployee}
                onChange={this.updateSelectedEmployee}
                searchable
                labelKey="name"
                valueKey="emp_id"
                style={{fontSize: 12, width: 185}}
                menuContainerStyle={{fontSize: 12, width: 185}}
              />
            </div>
          </span>
        </span>
        : null}
        <div className="content table-responsive table-full-width">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { this.state.edit ?
              <tr className="background-grey-color">
                <td>...</td>
                <td>...</td>
                <td></td>
              </tr>
              : null}
              { this.state.team ? this.state.team.map((member, index) => (
                <tr key={index} className="">
                  <td className="width-500 valign height-53">{member.emp_id}</td>
                  <td className='valign'>{member.name}</td>
                  {this.state.edit ?
                  <td className='valign cursor-pointer'>
                    <i onClick={this.remove.bind(this, index)} className="padding-right-10 fa fa-trash"></i>
                  </td>
                  : null}
                </tr>
              )) : null}
            </tbody>
          </table>
          <div className="center-align">
              {this.state.edit ?
                <span>
                  <button onClick={this.cancel.bind(this)} type="button" className="margin-5 btn btn-rectangle btn-wd btn-info">
                    <span className="margin-5 btn-label">
                      <i className="padding-right-10"></i> Cancel
                      </span>
                  </button>
                  <button onClick={this.save.bind(this)} type="button" className="margin-5 btn btn-rectangle btn-wd btn-info">
                    <span className="margin-5 btn-label">
                      <i className="padding-right-10 fa fa-plus"></i> Save
                      </span>
                  </button>
                </span>
              :  this.props.user.emp_role == 'PROJECT LEAD' ?
                <button onClick={() => (this.setState({edit: true}))} type="button" className="margin-5 btn btn-rectangle btn-wd btn-info">
                  <span className="btn-label">
                    <i className="padding-right-10 fa fa-edit"></i> Edit
                  </span>
                </button>
              : null
              }
          </div>
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'Team'
})(Team);
