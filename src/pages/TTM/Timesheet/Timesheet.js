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
import Tasks from './Tasks.js';
import JSONToCSVConvertor from './JsonToCsv.js';

function toObjectArray(arr) {
  let objectArray = []
  for (var i = 0; i < arr.length; ++i) {
    let obj = {
      label: null,
      value: null
    }
    obj.label = i;
    obj.value = arr[i];
    objectArray.push(obj);
  }
  return objectArray;
}

function countDecimals(value) {
  if (!value || Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
}

function correctHours(hours) {
  let h = JSON.parse(hours);
  let g = {}
  for (var i = 1; i < 8; i++) {
    g[i] = h[i-1][i];
  }
  return g;
}

function incorrectHours(hours) {
  let h = [];
  for (var i = 1; i < 8; i++) {
    h[i-1] = {};
    h[i-1][i] = hours[i];
  }
  return h;
}

class Timesheet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      startDate: moment(),
      endDate: moment(),
      dateRangeFocusedInput: null,
      editable: true,
      employees: [],
      selectedEmployee: {},
      rows: [], // type, projectCode/null, projectActivity/nonProjectActivity, hours, weekTotal
      types: [],
      projectCodes: [],
      projectActivities: [],
      nonProjectActivities: [],
      activityTotal: {hours: {}}, // hours, weekTotal (special row)
      disabled: false,
      notifications: [],
      rep_mgr_emp_id: ''
    }

    this.updateSelectedType = this.updateSelectedType.bind(this);
    this.updateSelectedProjectCode = this.updateSelectedProjectCode.bind(this);
    this.updateSelectedActivity = this.updateSelectedActivity.bind(this);
    this.updateSelectedEmployee = this.updateSelectedEmployee.bind(this);
  }

  componentDidMount() {
    this.EmployeesList();
    this.updateSelectedEmployee({
      "emp_id": this.props.user.user.emp_id,
      "name": this.props.user.user.name
    })
    this.ActivitiesList();
    this.getNotifications();
    //this.getData({date: moment()});
  }

  EmployeesList() {
    $.getJSON('https://qxuz4wter3.execute-api.eu-central-1.amazonaws.com/stage_employee_list')
      .then(({ body }) => {
        this.setState({ employees: body });
      });
  }

  ActivitiesList() {
    $.getJSON('https://dcy4bploj6.execute-api.eu-central-1.amazonaws.com/stage_list_value')
      .then(({ body }) => {
        this.setState({ projectActivities: toObjectArray(body.project_activities), nonProjectActivities: toObjectArray(body.non_proj_activities) });
      });
  }

  getData({date, emp_id}) {
    let start_date = date.subtract(date.day(), "days").format("YYYY-MM-DD");
    let current_start_date = moment().subtract(moment().day(), "days");
    let diff = moment(start_date).diff(current_start_date, "days");
    let disabled = false;

    if (diff > 28) {
      swal('Locked', 'You can only fill up to 4 weeks in future', 'info');
      return;
    } else if (diff < -14) {
      disabled = true;
    }

    this.setState({date, start_date, disabled})

    let data = {
      "emp_id": emp_id ? emp_id : this.state.selectedEmployee.emp_id,
      "date": moment(start_date).add(1, "days").format('YYYY-MM-DD'),
    }

    let projectActivities = this.state.projectActivities;
    let nonProjectActivities = this.state.nonProjectActivities;

    $.post('https://a8viaigtel.execute-api.eu-central-1.amazonaws.com/stage_gettimesheetdata_new',
      JSON.stringify(data),
      (function(data) {
        let rows = [];
        let activityTotal = {hours: {}, weekTotal: 0}

        data.body.map(function(dataRow){
          //let charge_code = dataRow.activity == undefined ? null : dataRow.category == 'Project' ? projectActivities[dataRow.activity]['value'] : nonProjectActivities[dataRow.activity]['value'];

          let row = {
            type: dataRow.category.toLowerCase(),
            projectCode: dataRow.charge_code.split('_')[0] ,
            activity: dataRow.charge_code.split('_')[1],
            hours: correctHours(dataRow.hours),
            status: dataRow.status,
            weekTotal: 0
          }
          for (var i = 1; i < 8; ++i) {
            row['weekTotal'] = row['weekTotal'] + parseFloat(row.hours[i] || 0);
            activityTotal.hours[i] = parseFloat(activityTotal.hours[i] || 0) + parseFloat(row.hours[i] || 0);
          }
          activityTotal.weekTotal = activityTotal.weekTotal + row['weekTotal']

          rows.push(row);

          // disabled or not
          if (dataRow.status == 'submitted' || dataRow.status == 'approved') {
            disabled = true;
          } else {
            disabled = false;
          }
        });
        this.setState({rows, activityTotal, disabled})
      }).bind(this),
      "json");
  }

	updateSelectedEmployee (newValue) {
    newValue = newValue || {};

    this.setState({
      selectedEmployee: newValue
    });

    this.getData({date: this.state.date, emp_id: newValue.emp_id})

    // set rep_mgr_emp_id and projectCodes
    let data = {
      emp_id: newValue.emp_id
    }
    $.post('https://4hl2y18qdf.execute-api.eu-central-1.amazonaws.com/stage_getempreportingmanagerid',
      JSON.stringify(data),
      (function(data) {
        console.log('manager', data)
        this.setState({rep_mgr_emp_id: data.body[0].emp_id})
      }).bind(this),
      "json");

    $.post('https://r5llg55ma1.execute-api.eu-central-1.amazonaws.com/stage_get_projectnamefromuserid',
      JSON.stringify(data),
      (function(data) {
        this.setState({projects: data.body})
      }).bind(this),
      "json");
	}

  updateSelectedType(index) {
    return function(newValue) {
      let rows = this.state.rows;
      rows[index]['type'] = newValue;
      this.setState({rows})
    }.bind(this);
  }

  updateSelectedProjectCode(index, value) {
    return function(newValue) {
      let rows = this.state.rows;
      rows[index]['projectCode'] = newValue;
      this.setState({rows})
    }.bind(this);
  }

  updateSelectedActivity(index, value) {
    return function(newValue) {
      let rows = this.state.rows;
      rows[index]['activity'] = newValue;
      this.setState({rows})
    }.bind(this);
  }

  handleCellChange(index, day, event) {
    let newValue = parseFloat(event.target.value);
    if (isNaN(event.target.value) || newValue > 24 || countDecimals(newValue) > 1) {
      return '';
    }

    // cell
    let rows = this.state.rows;
    rows[index]['hours'][day] = event.target.value;

    // week total for this cell row
    let rowWeekTotal = 0;
    for (var i=1; i<8; i++) {
      rowWeekTotal = rowWeekTotal + parseFloat(rows[index]['hours'][i] || 0);
    }
    rows[index]['weekTotal'] = rowWeekTotal;

    // activity total for this cell column and activity week total
    let dayActivityTotal = 0, weekActivityTotal = 0;
    let activityTotal = this.state.activityTotal;
    this.state.rows.map(function(row) {
      dayActivityTotal = dayActivityTotal + parseFloat(row['hours'][day] || 0);
      weekActivityTotal = weekActivityTotal + parseFloat(row['weekTotal'] || 0 );
    });
    dayActivityTotal = dayActivityTotal || 0;
    weekActivityTotal = weekActivityTotal || 0;
    activityTotal['hours'][day] = dayActivityTotal;
    activityTotal.weekTotal = weekActivityTotal;

    // week activity total
    this.setState({rows, activityTotal})
  }

  addRow() {
    let newRow = {hours: {}}
    let rows = this.state.rows;
    rows.push(newRow);
    this.setState({rows});
  }

  removeRow() {
    let rows = this.state.rows;
    let lastRow = rows[rows.length - 1];

    rows.pop();

    // update activityTotal for all days
    let activityTotal = this.state.activityTotal;
    let days = ['1', '2', '3', '4', '5', '6', '7'];
    days.map(function(day) {
      activityTotal['hours'][day] = activityTotal['hours'][day] - lastRow['hours'][day];
    })
    activityTotal.weekTotal = activityTotal.weekTotal - lastRow.weekTotal;

    this.setState({rows, activityTotal});
  }

  save() {
    let rows = this.state.rows;
    let projectActivities = this.state.projectActivities;
    let nonProjectActivities = this.state.nonProjectActivities;
    let data = [];
    this.setState({loadingSave: true});
    for (var j=0; j<rows.length; j++) {
      let row = rows[j];
      let obj = {
          emp_id: this.state.selectedEmployee.emp_id,
          category: row.type,
          proj_code: Math.floor(Math.random() * 1000000),
          charge_code: row.projectCode + '_' + row.activity,
          date: moment(this.state.start_date).add(1, "days").format('MM-DD-YYYY'),
          hours: incorrectHours(row.hours),
          approv_id: "22",
          status: "saved"
        }
        data.push(obj);
      }

    let request = {data}
    $.post('https://asasp5re94.execute-api.eu-central-1.amazonaws.com/stage_save_timesheetdata_new',
      JSON.stringify(request),
      (function(result) {
        this.setState({loadingSave: false})
        if (result.statusCode == 200) {
          swal("Saved Successfully", "Your working hours have been saved.", "success")
        } else {
          swal("Error", "Data could not be saved", "error");
        }

      }).bind(this),
      "json");
  }

  submit() {
    let rows = this.state.rows;
    let projectActivities = this.state.projectActivities;
    let nonProjectActivities = this.state.nonProjectActivities;
    let data = [];
    this.setState({loadingSubmit: true});
    for (var j=0; j<rows.length; j++) {
      let row = rows[j];

      let obj = {
          emp_id: this.state.selectedEmployee.emp_id,
          category: row.type,
          proj_code: Math.floor(Math.random() * 1000000),
          charge_code: row.projectCode + '_' + row.activity,
          date: moment(this.state.start_date).add(1, "days").format('MM-DD-YYYY'),
          hours: incorrectHours(row.hours),
          approv_id: "22",
          status: "submitted"
        }
        data.push(obj);
      }

    let request = {data}
    $.post('https://4ptw5fuand.execute-api.eu-central-1.amazonaws.com/stage_submittimesheetdata_new',
      JSON.stringify(request),
      (function(result) {
        this.setState({loadingSubmit: false})
        if (result.statusCode == 200) {
          this.setState({disabled: true});

          let request = {
            emp_id: this.state.selectedEmployee.emp_id,
            rep_mgr_emp_id: this.state.rep_mgr_emp_id,
            date1: this.state.date.format('YYYY-MM-DD'),
            message_type: 'APPROVE'
          }
          console.log(request)
          $.post('https://3gg1m1cof2.execute-api.eu-central-1.amazonaws.com/stage_savenotication',
            JSON.stringify(request),
            (function(data) {
            }).bind(this),
            "json")

          swal("Submitted Successfully", "Your working hours have been submitted.", "success");
        } else {
          swal("Error", "Data could not be submitted", "error");
        }

      }).bind(this),
      "json");
  }

  undoSubmission() {
    let rows = this.state.rows;

    for (var j=0; j<rows.length; j++) {
      let row = rows[j];
      let request = {
        emp_id: this.state.selectedEmployee.emp_id,
        charge_code: row.projectCode + '_' + row.activity,
        date: this.state.date.startOf('isoWeek').format('MM-DD-YYYY'),
      }
      $.post('https://c1fjt0mb8l.execute-api.eu-central-1.amazonaws.com/stage_modifytimesheetstatussubmitedtosave_new',
        JSON.stringify(request),
        (function(result) {
          if (result.statusCode == 200) {
            this.setState({disabled: false});
          }
        }).bind(this),
        "json");
    }
  }

  downloadData() {
    let dates = [];
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
    let date = startDate.subtract(startDate.day() - 1, "days").format("YYYY-MM-DD");
    while (endDate.diff(date, "days") >= 0) {
      dates.push(date);
      date = moment(date).add(7, "days").format("YYYY-MM-DD");
    }

    let emp_id = this.state.selectedEmployee.emp_id;
    let data = [];
    dates.map((date, index) => (
      $.post('https://a8viaigtel.execute-api.eu-central-1.amazonaws.com/stage_gettimesheetdata_new',
        JSON.stringify({emp_id, date}),
        (function(response) {
          data[index] = response.body;
          if (index == dates.length - 1) {
            JSONToCSVConvertor(data, emp_id + '_' + index + '_weeks.xlsx', true);
          }
        }).bind(this),
        "json")
    ))
  }

  requestResubmission() {
    let request = {
      emp_id: this.props.user.user.emp_id,
      rep_mgr_emp_id: this.state.rep_mgr_emp_id,
      date1: this.state.date.format('YYYY-MM-DD'),
      message_type: 'UNLOCK'
    }
    console.log(request)
    $.post('https://3gg1m1cof2.execute-api.eu-central-1.amazonaws.com/stage_savenotication',
      JSON.stringify(request),
      (function(data) {
        if (data.statusCode == 200) {
          console.log(data.body, 'print')
          swal('Request Sent', 'The request for unlocking has been sent to the approver', 'success');
        } else {
          swal('Erorr', 'There is some error sending request', 'error');
        }
      }).bind(this),
      "json")
  }

  getNotifications() {
    let request = {
      emp_id: this.props.user.user.emp_id
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
    const { date, startDate, endDate } = this.state;

    let start_date = moment(this.state.start_date);

    return (
      <div>
        <div className="header vmargin-10">
          <span className='blue-color heading'>Enter Time Data</span>
          <i onClick={() => {this.getData({date: this.state.date}); this.getNotifications()}} className="blue-color cursor-pointer margin-5 fa fa-refresh"></i>
        </div>
        <div>

          <div className="row">

            <div className="col-md-6">
              <Tasks user={this.props.user.user} notifications={this.state.notifications} />
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="content">

                  <label className="blue-title left-align">Download Historical Data</label>
                  <div className="form-group">
                    <DateRangePicker
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      focusedInput={this.state.dateRangeFocusedInput}
                      isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                      onFocusChange={focusedInput => this.setState({dateRangeFocusedInput: focusedInput})}
                      onDatesChange={({startDate, endDate}) => this.setState({startDate, endDate})} />
                  </div>

                  <button key="active" type="button" onClick={this.downloadData.bind(this)} className="btn-hollow btn btn-rectangle btn-wd btn-info">
                    <span className="btn-label">
                    </span> Download
                  </button>

                </div>
              </div>
            </div>

          </div>

          <label className="width-100 blue-title eft-align margin-bottom-20">Select Week - </label>
          <span className="form-group">
            <SingleDatePicker
              date={date}
              onDateChange={date => this.getData({date})}
              focused={this.state.focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
              isOutsideRange={() => false}
            />
          </span>

          <div className="content table-responsive table-full-width">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th className="center-align width-40 font-15 valign background-blue">Type</th>
                  <th className="center-align width-40 font-15 valign background-blue">Project</th>
                  <th className="center-align width-75 font-15 valign background-blue">Activity</th>
                  <th className="center-align width-40 font-15 background-blue">{moment(this.state.start_date).format('MM/DD/YYYY')} <br /> Sun</th>
                  <th className="center-align width-40 font-15 background-blue">{moment(this.state.start_date).add(1, 'days').format('MM/DD/YYYY')} <br /> Mon</th>
                  <th className="center-align width-40 font-15 background-blue">{moment(this.state.start_date).add(2, 'days').format('MM/DD/YYYY')} <br /> Tue</th>
                  <th className="center-align width-40 font-15 background-blue">{moment(this.state.start_date).add(3, 'days').format('MM/DD/YYYY')} <br /> Wed</th>
                  <th className="center-align width-40 font-15 background-blue">{moment(this.state.start_date).add(4, 'days').format('MM/DD/YYYY')} <br /> Thu</th>
                  <th className="center-align width-40 font-15 background-blue">{moment(this.state.start_date).add(5, 'days').format('MM/DD/YYYY')} <br /> Fri</th>
                  <th className="center-align width-40 font-15 background-blue">{moment(this.state.start_date).add(6, 'days').format('MM/DD/YYYY')} <br /> Sat</th>
                  <th className="center-align width-40 font-15 background-blue">Week <br /> Total</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.rows.map((row, index) => (
                    <tr key={index} className="background-grey-color">
                      <td className="center-align width-40 background-grey-color">
                        <VirtualizedSelect ref="countrySelect"
                          options={[
                            { value: 'project', label: 'Project' },
                            { value: 'non-project', label: 'Non-Project' },
                          ]}
                          simpleValue
                          value={this.state.rows[index].type}
                          onChange={this.updateSelectedType(index)}
                          labelKey="label"
                          valueKey="value"
                          clearable={false}
                          style={{fontSize: 10}}
                          menuContainerStyle={{fontSize: 10}}
                          disabled={this.state.disabled}
                        />
                      </td>
                      <td className="center-align width-100 background-grey-color">
                        <VirtualizedSelect ref="countrySelect"
                          options={this.state.projects}
                          simpleValue
                          value={this.state.rows[index].type == 'project' ? this.state.rows[index].projectCode : null}
                          onChange={this.updateSelectedProjectCode(index)}
                          labelKey="title"
                          valueKey="title"
                          clearable={false}
                          disabled={!this.state.disabled && this.state.rows[index].type == 'project' ? false : true}
                          style={{fontSize: 10}}
                          menuContainerStyle={{fontSize: 10}}
                        />
                      </td>
                      <td className="center-align width-100 background-grey-color">
                        <VirtualizedSelect ref="countrySelect"
                          options={this.state.rows[index] && this.state.rows[index].type == 'project' ? this.state.projectActivities : this.state.nonProjectActivities}
                          simpleValue
                          value={this.state.rows[index] ? this.state.rows[index].activity : ""}
                          onChange={this.updateSelectedActivity(index)}
                          labelKey="value"
                          valueKey="label"
                          clearable={false}
                          disabled={!this.state.disabled && this.state.rows[index].type ? false : true}
                          style={{fontSize: 10}}
                          menuContainerStyle={{fontSize: 10}}
                        />
                      </td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[1]} onChange={this.handleCellChange.bind(this, index, '1')} /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[2]} onChange={this.handleCellChange.bind(this, index, '2')} /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[3]} onChange={this.handleCellChange.bind(this, index, '3')} /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[4]} onChange={this.handleCellChange.bind(this, index, '4')} /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[5]} onChange={this.handleCellChange.bind(this, index, '5')} /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[6]} onChange={this.handleCellChange.bind(this, index, '6')} /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[7]} onChange={this.handleCellChange.bind(this, index, '7')} /></td>
                      <td className="center-align width-40 week-cell background-grey-color">{row.weekTotal}</td>
                    </tr>
                  ))
                }

                <tr className="background-grey-color">
                  <td className="center-align width-40 bold">
                    {!this.state.disabled ?
                      <span>
                        <i onClick={this.addRow.bind(this)} className="margin-left blue-color cursor-pointer fa fa-plus-square"></i>
                        {this.state.rows.length > 0 ? <i onClick={this.removeRow.bind(this)} className="margin-5 blue-color cursor-pointer fa fa-minus-square"></i> : null}
                      </span>
                    : null}
                  </td>
                  <td className="center-align width-40 bold">Activity Total</td>
                  <td className="center-align width-40 bold">-</td>
                  <td className="center-align width-40 bold">{Math.round(this.state.activityTotal.hours[1] * 10 || 0) / 10}</td>
                  <td className="center-align width-40 bold">{Math.round(this.state.activityTotal.hours[2] * 10 || 0) / 10}</td>
                  <td className="center-align width-40 bold">{Math.round(this.state.activityTotal.hours[3] * 10 || 0) / 10}</td>
                  <td className="center-align width-40 bold">{Math.round(this.state.activityTotal.hours[4] * 10 || 0) / 10}</td>
                  <td className="center-align width-40 bold">{Math.round(this.state.activityTotal.hours[5] * 10 || 0) / 10}</td>
                  <td className="center-align width-40 bold">{Math.round(this.state.activityTotal.hours[6] * 10 || 0) / 10}</td>
                  <td className="center-align width-40 bold">{Math.round(this.state.activityTotal.hours[7] * 10 || 0) / 10}</td>
                  <td className="center-align width-40 bold">{Math.round(this.state.activityTotal.weekTotal * 10 || 0) / 10}</td>
                </tr>

              </tbody>
            </table>
          </div>

          {
            this.state.disabled ?
              <div className="center-align">
                <button key="active" type="button" onClick={this.requestResubmission.bind(this)} className="margin-5 btn-hollow btn btn-rectangle btn-wd btn-info">
                  <span className="btn-label">
                  </span> Request Re-Submission
                </button>
              </div>
            : null
          }
        </div>

        <div className='center-align margin-15 places-buttons'>
          <div>
            <span>
              {
                this.state.loadingSave && this.state.rows.length ?
                  <button key="loading" type="button" className="margin-5 btn-loading btn-loading btn btn-rectangle btn-wd btn-info">
                    <span className="btn-label">
                    <i className="fa fa-spinner"></i>
                    </span> Save
                  </button>
              :  !this.state.disabled && this.state.rows.length ?
                  <button key="active" type="button" onClick={this.save.bind(this)} className="margin-5 btn-hollow btn btn-rectangle btn-wd btn-info">
                    <span className="btn-label">
                    <i className="fa fa-plus-square"></i>
                    </span> Save
                  </button>
              : null
              }
            </span>
            <span>
              {
                this.state.loadingSubmit && this.state.rows.length ?
                  <button key="loading" type="button" className="margin-5 btn-loading btn-loading btn-active btn btn-rectangle btn-wd btn-info">
                    <span className="btn-label">
                    <i className="fa fa-spinner"></i>
                    </span> Submit
                  </button>
              : !this.state.disabled && this.state.rows.length ?
                  <button key="active" type="button" onClick={this.submit.bind(this)} className="margin-5 btn-active btn btn-rectangle btn-wd btn-info">
                    <span className="btn-label">
                    <i className="fa fa-plus-square"></i>
                    </span> Submit
                  </button>
              : null
              }
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'formElements'
})(Timesheet);
