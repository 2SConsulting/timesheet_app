import React from 'react';
import $ from 'jquery'
import VirtualizedSelect from 'react-virtualized-select';
import moment from 'moment';
import { SingleDatePicker, DateRangePicker, DayPickerRangeController, isInclusivelyBeforeDay} from 'react-dates';
import swal from 'sweetalert';

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

const projectFields = [
  'proj_code',
  'title',
  'customer_id',
  'proj_status',
  'emp_id',
  'in_start_date',
  'rv_start_date',
  'in_end_date',
  'rv_end_date',
  'proj_bd_lead',
  'ihs_service_line',
  'bu_name',
  'objectives',
  'speciality',
  'department',
  'cross_charge',
  'cost_center_xcharge',
  'proj_approver',
  'appr_status',
  'written_approval',
  'box_link',
]

const statusValues = ['Initiate', 'Ongoing', 'On Hold', 'Closed', 'Canceled']
const approverValues = ['To Be Approved', 'Not approved', 'Approved']
const yesNoValues = ['Yes', 'No']

function getData(project) {
  console.log('get data', project);
    return [
      {id: 0, key: "Project Code", value: "" || project.proj_code},
      {id: 1, key: "Project Title", value: "" || project.title},
      {id: 2, key: "Client Name", value: "" || project.customer_id},
      {id: 3, key: "Project Status", value: "" || project.proj_status, label: statusValues.indexOf(project.proj_status)},
      {id: 4, key: "Project Lead", value: "" || project.emp_id},
      {id: 5, key: "Initial Start Date", value: "" || moment(project.in_start_date).format('YYYY-MM-DD')},
      {id: 6, key: "Revised Start Date", value: "" || moment(project.rv_start_date).format('YYYY-MM-DD')},
      {id: 7, key: "Initial End Date", value: "" || moment(project.in_end_date).format('YYYY-MM-DD')},
      {id: 8, key: "Revised End Date", value: "" || moment(project.rv_end_date).format('YYYY-MM-DD')},
      {id: 9, key: "IHS BD lead", value: "" || project.proj_bd_lead},
      {id: 10, key: "IHS Service Line", value: "" || project.ihs_service_line},
      {id: 11, key: "BU", value: "" || project.bu_name},
      {id: 12, key: "Objectives", value: "" || project.objectives},
      {id: 13, key: "Specialty", value: "" || project.speciality},
      {id: 14, key: "Department", value: "" || project.department},
      {id: 15, key: "Cross-charging internally", value: "" || project.cross_charge, label: yesNoValues.indexOf(project.cross_charge)},
      {id: 16, key: "Cost center for cross-charging", value: "" || project.cost_center_xcharge},
      {id: 17, key: "Approver / Cost Center Owner", value: "" || project.proj_approver},
      {id: 18, key: "Approval status", value: "" || project.appr_status, label: approverValues.indexOf(project.appr_status)},
      {id: 19, key: "Written approval", value: "" || project.written_approval, label: yesNoValues.indexOf(project.written_approval)},
      {id: 20, key: "Box Link", value: "" || project.box_link},
    ]
}

class GeneralInfo extends React.Component {
  constructor(props) {
    super(props);

    this._handleFocus = this._handleFocus.bind(this);
    this._handleFocusOut = this._handleFocusOut.bind(this);

    let project = props.project;
    this.state = {
      edit: false,
      data: getData(props.project),
      options: [],
      dates: [moment(), moment(), moment(), moment()],
      focused: [false, false, false, false],
      employees: [],
      ihs_service_line: [],
      bu_name: [],
      objectives: [],
      speciality: [],
      department: []
    }
  }

  componentDidMount() {
    this.dropdownList();
    this.ApproverList();
  }

  dropdownList() {
    $.getJSON('https://dcy4bploj6.execute-api.eu-central-1.amazonaws.com/stage_list_value')
      .then(({ body }) => {
        let options = this.state.options;
        options[10] = toObjectArray(body.ihs_service_line);
        options[11] = toObjectArray(body.bu_name);
        options[12] = toObjectArray(body.objectives);
        options[13] = toObjectArray(body.specialty);
        options[14] = toObjectArray(body.department);
        options[3] = toObjectArray(statusValues);
        options[18] = toObjectArray(approverValues);
        options[15] = toObjectArray(yesNoValues);
        options[19] = toObjectArray(yesNoValues);
        this.setState({ options, ihs_service_line: body.ihs_service_line, bu_name: body.bu_name, objectives: body.objectives, speciality: body.speciality, department: body.department });
      });
  }

  ApproverList() {
    $.getJSON('https://qxuz4wter3.execute-api.eu-central-1.amazonaws.com/stage_employee_list')
      .then(({ body }) => {
        let options = this.state.options;
        options[4] = body;
        options[9] = body;
        options[17] = body;
        console.log(options, 'options')
        this.setState({ options, employees: body });
      });
  }

  _handleFocus(text) {
      console.log('Focused with text: ' + text);
  }

  _handleFocusOut(text) {
      console.log('Left editor with text: ' + text);
  }

  handleChange(index, event) {
    let data = this.state.data;
    data[index]['value'] = event.target.value;
    this.setState({data});
  }

  cancel() {
      this.setState({edit: false, data: getData(this.props.project)})
  }

  select (newValue, index) {
    let data = this.state.data;
    data[index] = newValue;
		this.setState({data});
	}

  save() {
    let project = {}
    for (var index = 0; index < this.state.data.length; index++) {
      if (index == 5 || index == 6 || index == 7 || index == 8)
        project[projectFields[index]] = this.state.dates[index-5].format('YYYY-MM-DD');
      else
        project[projectFields[index]] = this.state.data[index].value;

      if (!project[projectFields[index]]) {
        swal('Invalid Data', 'Please fill out all the fields', 'error');
        return;
      }
    }

    project.id = this.props.project.id;
    project.customer_id = this.props.project.customer_id;
    project.country_id = this.props.project.country_id;
    console.log(this.props.project, JSON.stringify(project));
    $.post('https://i09uwy3hmi.execute-api.eu-central-1.amazonaws.com/stage_modify_project_details',
      JSON.stringify(project),
      (function(res) {
        console.log('res', res)
        if (res.statusCode==200) {
          swal('Details Updated', 'Project details have been updated successfully', 'success');
          this.setState({edit: false});
        } else {
          swal('Error', 'Please check all the fields properly', 'error');
        }

        let data = {proj_code: project.proj_code}
        $.post('https://4pg391re42.execute-api.eu-central-1.amazonaws.com/stage_getactiveproject',
          JSON.stringify(data),
          (function(ret) {
            let newData = this.state.data;
            newData[0].value = ret && ret.body && ret.body[0] ? ret.body[0].id : newData[0].value;
            this.setState({data: newData});
          }).bind(this),
          "json");
      }).bind(this),
      "json");
  }

  handleChange(index, event) {
    let length = event.target.value.length;
    if (index == 20 && length > 100) { // box link
      return;
    } else if (index == 1 && length > 60) { // title
      return;
    } else if (length > 45) {
      return;
    }
    let data = this.state.data;
    data[index]['value'] = event.target.value;
    this.setState({data})
  }

  handleSelect(index) {
    return function(newValue) {
      let data = this.state.data;
      data[index]['label'] = newValue;
      data[index]['value'] = index == 4 || index == 9 || index == 17 ? newValue : this.state.options[index][newValue]['value']
      this.setState({data})
      console.log(data)
    }.bind(this);
  }

  handleSelectDate(date, index) {
    let dates = this.state.dates;
    dates[index] = date;
    this.setState({dates});
  }

  setFocusedState(focus, index) {
    let focused = this.state.focused;
    focused[index] = focus.focused;
    this.setState({focused})
  }

  edit() {
    console.log(this.state.data);
    this.setState({edit: true});
  }

  render() {
    let project = this.props.project;
    return (
      <div>
        <div className="content table-responsive table-full-width">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.data ? this.state.data.map((item, index) => (
                <tr key={index} className="">
                  <td className="width-500 valign height-53">{item.key}</td>
                  {!this.state.edit ?
                    <td className='valign'>
                      {item.value}
                    </td>
                  : <td className='valign'>
                      {index == 3 || index == 4 || index == 9 || index == 10 || index == 11 || index == 12 || index == 13 || index == 14 || index == 15 || index == 17 || index == 18 || index == 19 ?
                        <VirtualizedSelect ref="countrySelect"
                          options={this.state.options[index]}
                          simpleValue
                          value={this.state.data[index].label}
                          onChange={this.handleSelect(index)}
                          labelKey={index == 4 || index == 9 || index == 17 ? "name" : "value"}
                          valueKey={index == 4 || index == 9 || index == 17 ? "emp_id" : "label"}
                          clearable={false}
                          style={{fontSize: 12, width: 132}}
                          menuContainerStyle={{fontSize: 12, width: 132}}
                          disabled={this.state.data[15].value == 'No' && (index == 16 || index == 17 || index == 18 || index == 19) ? true : false}
                        />
                      : index == 5 || index == 6 || index == 7 || index == 8 ?
                        <SingleDatePicker
                          date={this.state.dates[index-5]}
                          onDateChange={date => this.handleSelectDate(date, index-5)}
                          focused={this.state.focused[index - 5]}
                          onFocusChange={focus => this.setFocusedState(focus, index-5)}
                        />
                      : index == 0 || index == 2 ?
                        item.value
                      : <input type="text" disabled={this.state.data[15].value == 'No' && index == 16 ? true : false} className="width-130 form-control" value={this.state.data[index].value} onChange={this.handleChange.bind(this, index)} />
                      }
                    </td>
                  }
                </tr>
              )) : null
            }
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
                <button onClick={this.edit.bind(this)} type="button" className="margin-5 btn btn-rectangle btn-wd btn-info">
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

export default GeneralInfo;
