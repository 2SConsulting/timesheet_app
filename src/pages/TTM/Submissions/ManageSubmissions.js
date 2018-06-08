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
import { SingleDatePicker, DateRangePicker, DayPickerRangeController, isInclusivelyBeforeDay} from 'react-dates';
import moment from 'moment';
import Tasks from './Tasks';
import Timesheet from './Timesheet';

const START_DATE = 'startDate'
class ManageSubmissions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      startDate: moment(),
      endDate: moment(),
      dateRangeFocusedInput: null,
      employees: [],
      statuses: [],
      selectedEmployee: {}
    }

    this.updateSelectedEmployee = this.updateSelectedEmployee.bind(this);
  }

  componentDidMount() {
    this.EmployeesList();
    this.getNotifications();
  }

  EmployeesList() {
    let request = {
      rep_mgr_emp_id: this.props.user.user.emp_id
    }

    console.log(request);
    $.post('https://gbda4ql1l3.execute-api.eu-central-1.amazonaws.com/stage_reportingmanagerteamlist',
      JSON.stringify(request),
      (function(result) {
        if (result.statusCode == 200) {
          console.log('list', result.body)
          this.setState({employees: result.body});
          this.getStatus({date: moment(), employees: result.body});
        }
      }).bind(this),
      "json");
  }

  getStatus({date, employees}) {
    employees = employees ? employees : this.state.employees;
    for (var index = 0; index < employees.length; index++) {
      employees[index]['status'] = null;
    }
    this.setState({date, employees});

    let start_date = date.subtract(date.day() - 1, "days").format("YYYY-MM-DD");
    let start_date_sunday = date.subtract(date.day(), "days").format("YYYY-MM-DD");
    employees.map((employee, index) => (
      $.post('https://a8viaigtel.execute-api.eu-central-1.amazonaws.com/stage_gettimesheetdata_new',
        JSON.stringify({emp_id: employee.emp_id, date: start_date}),
        (function(data) {
          console.log('status api', data);
          let statuses = this.state.statuses;
          statuses[index] = data.body[0] && data.body[0].status ? data.body[0].status : 'saved';
          this.setState({statuses});
        }).bind(this),
        "json")
    ))
  }

  updateStatus(emp_id, status, index) {
    console.log(emp_id, status)
    let start_date = this.state.date.subtract(this.state.date.day() - 1, "days").format("YYYY-MM-DD");
    let request = {
      date: start_date,
      emp_id: emp_id,
      status: status
    }
    $.post('https://5hkvw9hvr7.execute-api.eu-central-1.amazonaws.com/stage_modifytimesheetstatus_new',
      JSON.stringify(request),
      (function(data) {
        if (data.statusCode == 200) {
          let statuses = this.state.statuses;
          statuses[index] = status;
          this.setState({statuses});
          swal('Status Updated', '', 'success');

          let request = {
            emp_id: emp_id,
            rep_mgr_emp_id: this.props.user.user.emp_id,
            date1: this.state.date.format('YYYY-MM-DD'),
            message_type: status == 'approved' ? 'APPROVE' : 'UNLOCK'
          }
          console.log(request)
          $.post('https://3gg1m1cof2.execute-api.eu-central-1.amazonaws.com/stage_savenotication',
            JSON.stringify(request),
            (function(data) {
            }).bind(this),
            "json")

        } else {
          swal('Erorr', 'Status could not be updated', 'error');
        }
      }).bind(this),
      "json")
  }

  sendReminder(emp_id) {
    let request = {
      emp_id: emp_id,
      rep_mgr_emp_id: this.props.user.user.emp_id,
      date1: this.state.date.format('YYYY-MM-DD'),
      message_type: 'REMINDER'
    }
    console.log(request)
    $.post('https://3gg1m1cof2.execute-api.eu-central-1.amazonaws.com/stage_savenotication',
      JSON.stringify(request),
      (function(data) {
        if (data.statusCode == 200) {
          console.log(data.body, 'print')
          swal('Reminder Sent', 'The reminder has been sent to the consultant', 'success');
        } else {
          swal('Erorr', 'There is some error sending reminder', 'error');
        }
      }).bind(this),
      "json")
  }

	updateSelectedEmployee (newValue) {
		this.setState({
			selectedEmployee: newValue
		});
	}

  select(index) {
    this.setState({selectedEmployee: this.state.employees[index]});
  }

  getNotifications() {
    let request = {
      rep_mgr_emp_id: this.props.user.user.emp_id
    }
    $.post('https://9swj8e9o5h.execute-api.eu-central-1.amazonaws.com/stage_getnotifcationfilter',
      JSON.stringify(request),
      (function(response) {
        console.log(response);
        this.setState({notifications: response.body})
      }).bind(this),
      "json")
  }

  render() {
    let self = this;
    const { focusedInput, date, startDate, endDate } = this.state;

    let start_date = moment(this.state.start_date);

    return (

      <div>
          <div className="header vmargin-10">
            <span className='blue-color heading'>Manage Submissions</span>
            <i onClick={() => {this.EmployeesList.bind(this); this.getNotifications()}} className="blue-color cursor-pointer margin-5 fa fa-refresh"></i>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Tasks user={this.props.user.user} notifications={this.state.notifications} />
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="content">

                  <label className="blue-title left-align">Download Submission Data</label>
                  <div className="form-group">
                    <DateRangePicker
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      focusedInput={this.state.dateRangeFocusedInput}
                      isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                      onFocusChange={focusedInput => this.setState({dateRangeFocusedInput: focusedInput})}
                      onDatesChange={({startDate, endDate}) => this.setState({startDate, endDate})} />
                  </div>

                  <button key="active" type="button" className="btn-hollow btn btn-rectangle btn-wd btn-info">
                    <span className="btn-label">
                    </span> Download
                  </button>

                </div>
              </div>
            </div>
          </div>

            <label className="margin-5 blue-title eft-align margin-bottom-20">Select Week - </label>
            <span className="form-group">
              <SingleDatePicker
                date={date}
                onDateChange={date => this.getStatus({date})}
                focused={this.state.focused}
                onFocusChange={({ focused }) => this.setState({ focused })}
                isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
              />
            </span>

            <div className="content table-responsive table-full-width">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="center-align width-40 font-15 background-blue">Select</th>
                    <th className="center-align width-40 font-15 background-blue">User Id</th>
                    <th className="center-align width-40 font-15 background-blue">Name</th>
                    <th className="center-align width-40 font-15 background-blue">Submission Status</th>
                    <th className="center-align width-40 font-15 background-blue">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.employees.map((employee, index) => (
                      <tr key={index} className="background-grey-color">
                        <td className="center-align width-40 valign background-grey-color">
                          {this.state.selectedEmployee == employee ?
                            <i className="fa fa-check-square fa-lg blue-color"></i>
                          :
                            <i onClick={this.select.bind(this, index)} className="cursor-pointer fal fa-circle fa-lg"></i>
                          }
                        </td>
                        <td className="center-align width-40 valign background-grey-color">{employee.emp_id}</td>
                        <td className="center-align width-40 valign background-grey-color">{employee.name}</td>
                        {
                          this.state.statuses[index] == 'saved' ?
                            <td key='saved' className="center-align width-40 valign color-3">Pending</td>
                          : this.state.statuses[index] == 'submitted' ?
                            <td key='submitted' className="center-align width-40 valign color-2">Submitted</td>
                          : this.state.statuses[index] == 'approved' ?
                            <td key='approved' className="center-align width-40 valign blue-color">Approved</td>
                          :
                            <td key='null'> </td>
                        }
                        {
                        this.state.statuses[index] == 'submitted' ?
                          <td className="center-align width-40 valign background-grey-color">
                            <button onClick={this.updateStatus.bind(this, employee.emp_id, 'saved', index)} type="button" className="margin-5 btn-hollow btn btn-rectangle btn-wd btn-info">
                              <span className="margin-5 btn-label">
                                Unlock
                              </span>
                            </button>
                            <button onClick={this.updateStatus.bind(this, employee.emp_id, 'approved', index)} type="button" className="margin-5 btn-active btn btn-rectangle btn-wd btn-info">
                              <span className="margin-5 btn-label">
                                Approve
                              </span>
                            </button>
                          </td>
                        : this.state.statuses[index] == 'approved' ?
                          <td className="center-align width-40 valign background-grey-color">
                            <button onClick={this.updateStatus.bind(this, employee.emp_id, 'saved', index)} type="button" className="margin-5 btn-hollow btn btn-rectangle btn-wd btn-info">
                              <span className="margin-5 btn-label">
                                Unlock
                              </span>
                            </button>
                          </td>
                        : // saved
                          <td className="center-align width-40 valign background-grey-color">
                            <button onClick={this.sendReminder.bind(this, employee.emp_id)} key="active" type="button" className="margin-5 btn-hollow btn btn-rectangle btn-wd btn-info">
                              <span className="btn-label">
                              </span> Send Reminder
                            </button>
                          </td>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            <div className='height-50'>
              <label className="float-left width-120 margin-5 blue-title eft-align margin-bottom-20">Select Consultant - </label>
              <span className="form-group">
                <VirtualizedSelect ref="approverSelect"
                  options={this.state.employees}
                  clearable
                  name="select-approver"
                  value={this.state.selectedEmployee}
                  onChange={this.updateSelectedEmployee}
                  searchable
                  labelKey="name"
                  valueKey="emp_id"

                  style={{width: 200}}
                  menuContainerStyle={{width: 200, marginLeft: 130}}
                />
              </span>
            </div>

            <Timesheet employee={this.state.selectedEmployee} date={this.state.date} />
        </div>
    )
  }
}

export default reduxForm({
  form: 'formElements'
})(ManageSubmissions);
