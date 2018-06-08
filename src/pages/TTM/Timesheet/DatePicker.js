import React, { Component } from 'react';
import { SingleDatePicker} from 'react-dates';
import moment from 'moment';

export default class DatePicker extends Component {
  state = {
    date: moment(),
    startDate: moment(),
    endDate: moment(),
    dateRangeFocusedInput: null,

  };

  render() {
    let { date } = this.state;
    return (
      <div className="row">
        <div className="margin-left">
          <h4 className="title">Alexander Pierce</h4>
          <div class="divider"/>
          <div className="form-group">
            <SingleDatePicker
              date={date}
              onDateChange={date => this.setState({date})}
              focused={this.state.focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
            />
          </div>
        </div>
      </div>
    );
  }
}
