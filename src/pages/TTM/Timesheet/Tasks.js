import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: props.notifications ? props.notifications[0] || {} : {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications != this.props.notifications)
      this.setState({notification: nextProps.notifications[0] || {}});
  }

  render() {
    return (
      <div className="card height-145 ">
        <div className="header">
          <p className="blue-title">{this.props.user.name}</p>
          <p className="category">{this.props.user.emp_job_title} ( {this.props.user.emp_role}-{this.props.user.emp_id} )</p>
        </div>
        {this.state.notification.date1 ?
        <div className="content">
          <form>
            <div className={cx("todo-item", {completed: this.state.notification.completed})} key={this.state.notification.notification_id}>
              <div className="todo-item-wrapper">
                {this.state.notification.message_type == 'REMINDER' ?
                  <div className="todo-content blue-color">Pending submission on {moment(this.state.notification.date1).format('DD-MM-YYYY')}</div>
                : this.state.notification.message_type == 'UNLOCK' ?
                  <div className="todo-content blue-color">Unlocked submission on {moment(this.state.notification.date1).format('DD-MM-YYYY')}</div>
                : this.state.notification.message_type == 'APPROVE' ?
                  <div className="todo-content blue-color">Approved submission on {moment(this.state.notification.date1).format('DD-MM-YYYY')}</div>
                : null
                }
              </div>
            </div>
          </form>
        </div>
        : null}
      </div>
    );
  }
}

export default Tasks;
