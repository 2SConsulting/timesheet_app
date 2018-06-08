import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';
import uncheckImage from '../../../assets/images/checkbox-uncheck.svg';
import checkImage from '../../../assets/images/checkbox-check.svg';

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

  toggleComplete = notificationId => {
    this.setState({
      notifications: this.state.notifications.map(notification => {
        if (notification.notification_id === notificationId) notification.completed = !notification.completed;
        return notification;
      })
    });
  }

  deletenotification = notificationId => {
    this.setState({
      notifications: this.state.notifications.filter(notification => notification.notification_id !== notificationId)
    });
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
              <label className={cx("checkbox", {
                  checked: this.state.notification.completed
                })}
                >
                  <span className="icons">
                    <img className="first-icon" src={uncheckImage} width={17} height={20} />
                    <img className="second-icon" src={checkImage} width={17} height={20} />
                  </span>
                  <input type="checkbox" data-toggle="checkbox" checked={this.state.notification.completed} onChange={() => this.toggleComplete(this.state.notification.notification_id)} />
                </label>
                {this.state.notification.message_type == 'REMINDER' ?
                  <div className="todo-content blue-color">Pending submission on {moment(this.state.notification.date1).format('DD-MM-YYYY')}</div>
                : this.state.notification.message_type == 'UNLOCK' ?
                  <div className="todo-content blue-color">Unlock submission on {moment(this.state.notification.date1).format('DD-MM-YYYY')}</div>
                : this.state.notification.message_type == 'APPROVE' ?
                  <div className="todo-content blue-color">Approve submission on {moment(this.state.notification.date1).format('DD-MM-YYYY')}</div>
                : null
                }
                <a onClick={() => this.deletenotification(this.state.notification.notification_id)}>
                  &times;
                </a>
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
