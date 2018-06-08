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
      employees: props.employees,
      selectedEmployee: {},
      rows: [], // type, projectCode/null, projectActivity/nonProjectActivity, hours, weekTotal
      types: [],
      projectCodes: [],
      projectActivities: [],
      nonProjectActivities: [],
      activityTotal: {hours: {}}, // hours, weekTotal (special row)
      disabled: false,
    }

    this.updateSelectedEmployee = this.updateSelectedEmployee.bind(this);
  }

  componentDidMount() {
    this.props.employee.emp_id ? this.updateSelectedEmployee(this.props.employee) : null
    this.ActivitiesList();
    //this.getData({date: moment()});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.employee != this.props.employee || nextProps.date != this.props.date) {
      if (nextProps.date && nextProps.employee.emp_id)
        this.getData({date: nextProps.date, emp_id: nextProps.employee.emp_id});
    }
  }

  ActivitiesList() {
    $.getJSON('https://dcy4bploj6.execute-api.eu-central-1.amazonaws.com/stage_list_value')
      .then(({ body }) => {
        this.setState({ projectActivities: toObjectArray(body.project_activities), nonProjectActivities: toObjectArray(body.non_proj_activities) });
      });
  }

  getData({date, emp_id}) {
    console.log(date, emp_id);
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

    console.log(data)

    let projectActivities = this.state.projectActivities;
    let nonProjectActivities = this.state.nonProjectActivities;

    console.log(data)
    $.post('https://a8viaigtel.execute-api.eu-central-1.amazonaws.com/stage_gettimesheetdata_new',
      JSON.stringify(data),
      (function(data) {
        console.log('res', data)
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

    console.log('emp', newValue)
    this.setState({
      selectedEmployee: newValue
    });

    this.getData({date: this.state.date, emp_id: newValue.emp_id})

    // get getManager
    let data = {
      emp_id: newValue.emp_id
    }
    // set projectCodes
    $.post('https://r5llg55ma1.execute-api.eu-central-1.amazonaws.com/stage_get_projectnamefromuserid',
      JSON.stringify(data),
      (function(data) {
        console.log(data)
        this.setState({projects: data.body})
      }).bind(this),
      "json");
	}

  render() {
    let self = this;
    const { date, startDate, endDate } = this.state;

    let start_date = moment(this.state.start_date);

    return (
      <div>

        <div>
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
                          labelKey="value"
                          valueKey="label"
                          clearable={false}
                          disabled={!this.state.disabled && this.state.rows[index].type ? false : true}
                          style={{fontSize: 10}}
                          menuContainerStyle={{fontSize: 10}}
                        />
                      </td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[1]}  /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[2]}  /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[3]}  /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[4]}  /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[5]}  /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[6]}  /></td>
                      <td className="center-align width-40"><input type="number" min="0" className="timesheet-cell" disabled={this.state.disabled} value={row.hours[7]}  /></td>
                      <td className="center-align width-40 week-cell background-grey-color">{row.weekTotal}</td>
                    </tr>
                  ))
                }

                <tr className="background-grey-color">
                  <td className="center-align width-40 bold"></td>
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
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'formElements'
})(Timesheet);
