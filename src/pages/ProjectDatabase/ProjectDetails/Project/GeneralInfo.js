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
  'id',//0
  'proj_code',//1
  'proj_status',//2
  'title',//3
  'emp_id',//4
  'in_start_date',//5
  'rv_start_date',//6
  'in_end_date',//7
  'rv_end_date',//8
  'activebool',//9
  'cost_center_xcharge',//10
  'proj_approver',//11
  'appr_status',//12
  'written_approval',//13
  'proj_bd_lead',//14
  'box_link',//15
  'ihs_service_line',//16
  'bu_name',//17
  'objectives',//18
  'speciality',//19
  'department',//20
  'ihs_bd_lead',//21
  'proj_appr_name',//22
  'cross_charge'//23
]

function getData(project) {
  console.log('get data', project);
    return [
      {id: 0, key: "ID", value: "" || project.id},
      {id: 1, key: "Project Code", value: "" || project.proj_code},
      {id: 2, key: "Project Status", value: "" || project.proj_status},
      {id: 3, key: "Project Title", value: "" || project.title},
      {id: 4, key: "IHS Project Lead", value: "" || project.emp_id},
      {id: 5, key: "Start Date (planned)", value: "" || moment(project.in_start_date).format('YYYY-MM-DD')},
      {id: 6, key: "Start Date (revised)", value: "" || moment(project.rv_start_date).format('YYYY-MM-DD')},
      {id: 7, key: "End Date (planned)", value: "" || moment(project.in_end_date).format('YYYY-MM-DD')},
      {id: 8, key: "End Date (revised)", value: "" || moment(project.rv_end_date).format('YYYY-MM-DD')},
      {id: 9, key: "Active", value: project.activebool},
      {id: 10, key: "Cost center for cross-charging", value: "" || project.cost_center_xcharge},
      {id: 11, key: "Approver / cost center owner", value: "" || project.proj_approver},
      {id: 12, key: "Approval status", value: "" || project.appr_status},
      {id: 13, key: "Written approval", value: "" || project.written_approval},
      {id: 14, key: "IHS BD lead", value: "" || project.proj_bd_lead},
      {id: 15, key: "Box Link", value: "" || project.box_link},
      {id: 16, key: "IHS Service Line", value: "" || project.ihs_service_line},
      {id: 17, key: "Medtronic BU involved", value: "" || project.bu_name},
      {id: 18, key: "Objectives", value: "" || project.objectives},
      {id: 19, key: "Specialty", value: "" || project.speciality},
      {id: 20, key: "Department", value: "" || project.department},
      {id: 21, key: "IHS BD Lead", value: "" || project.ihs_bd_lead},
      {id: 22, key: "Project Approver Name", value: "" || project.proj_appr_name},
      {id: 23, key: "Cross Charge", value: "" || project.cross_charge},
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
      focused: [false, false, false, false]
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
        options[16] = toObjectArray(body.ihs_service_line);
        options[17] = toObjectArray(body.bu_name);
        options[18] = toObjectArray(body.objectives);
        options[19] = toObjectArray(body.specialty);
        options[20] = toObjectArray(body.department);
        options[9] = toObjectArray(['True', 'False']);
        options[2] = toObjectArray(['Initiate', 'Ongoing', 'On Hold', 'Canceled']);
        options[12] = toObjectArray(['To Be Approved', 'Not approved', 'Approved']);
        options[13] = toObjectArray(['Yes', 'No']);
        options[23] = toObjectArray(['Yes', 'No']);
        this.setState({ options });
      });
  }

  ApproverList() {
    $.getJSON('https://qxuz4wter3.execute-api.eu-central-1.amazonaws.com/stage_employee_list')
      .then(({ body }) => {
        let options = this.state.options;
        options[4] = body;
        options[11] = body;
        options[14] = body;
        console.log(options, 'options')
        this.setState({ options });
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
    if (index == 3 && length > 100) {
      return;
    } else if (index == 16 && length > 60) {
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
      data[index]['value'] = index == 4 || index == 11 || index == 14 ? newValue : this.state.options[index][newValue]['value']
      this.setState({data})
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
                  {this.state.edit?

                      <td className='valign'>
                      {item.key == 'ID' || item.key == 'Project Code'?this.state.data[index].value:
                         item.key == 'Project Status' || item.key == 'IHS Project Lead' || item.key == 'Approver / cost center owner' || item.key == 'Approval status' || item.key == 'Written approval' || item.key == 'IHS BD lead' || item.key == 'IHS Service Line' || item.key == 'Medtronic BU involved' || item.key == 'Objectives' || item.key == 'Specialty' || item.key == 'Department' || item.key == 'Cross Charge' ?
                         <VirtualizedSelect ref="countrySelect"
                          options={this.state.options[index]}
                          simpleValue
                          value={this.state.data[index].label}
                          onChange={this.handleSelect(index)}
                          labelKey={item.key == 'IHS Project Lead' || item.key == 'Approver / cost center owner' || item.key == 'IHS BD lead' ? "name" : "value"}
                          valueKey={item.key == 'IHS Project Lead' || item.key == 'Approver / cost center owner' || item.key == 'IHS BD lead' ? "emp_id" : "label"}
                          clearable={false}
                          style={{fontSize: 12, width: 132}}
                          menuContainerStyle={{fontSize: 12, width: 132}}
                        />:item.key == 'Start Date (planned)' || item.key == 'Start Date (revised)' || item.key == 'End Date (planned)' || item.key == 'End Date (revised)'?
                        <SingleDatePicker
                          date={this.state.dates[index-5]}
                          onDateChange={date => this.handleSelectDate(date, index-5)}
                          focused={this.state.focused[index - 5]}
                          onFocusChange={focus => this.setFocusedState(focus, index-5)}
                        />
                        :<input type="text" className="width-130 form-control" value={this.state.data[index].value} onChange={this.handleChange.bind(this, index)} />
                      }
                      </td> // edint end

                      :
                      <td className='valign'>{this.state.data[index].value}</td> // Display Part
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

export default GeneralInfo;
