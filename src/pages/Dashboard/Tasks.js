import React, { Component } from 'react';
import cx from 'classnames';
import uncheckImage from '../../assets/images/checkbox-uncheck.svg';
import checkImage from '../../assets/images/checkbox-check.svg';
import $ from 'jquery'
import moment from 'moment';

class Tasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      user: props.user || {}
    }
  }

  componentDidMount() {
    this.getNotifications();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.user != this.props.user) {
      this.setState({user: nextProps.user});
      this.getNotifications(nextProps.user);
    }
  }

  getNotifications() {
    let request = {
      emp_id: this.state.user.emp_id
    }
    $.post('https://9swj8e9o5h.execute-api.eu-central-1.amazonaws.com/stage_getnotifcationfilter',
      JSON.stringify(request),
      (function(response) {
        console.log(response);
        this.setState({notifications: response.body})
      }).bind(this),
      "json")
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
    console.log(this.props.user)
    return (
      <div className="card ">
        <div className="header">
          <h4 className="title">Notifications</h4>
          <p className="category">Time Management</p>
        </div>
        <div className="content">
          <form>
          {this.state.notifications.map(notification => (
            <div className={cx("todo-item", {completed: notification.completed})} key={notification.notification_id}>
              <div className="todo-item-wrapper">
              <label className={cx("checkbox", {
                  checked: notification.completed
                })}
                >
                  <span className="icons">
                    <img className="first-icon" src={uncheckImage} width={17} />
                    <img className="second-icon" src={checkImage} width={17} />
                  </span>
                  <input type="checkbox" data-toggle="checkbox" checked={notification.completed} onChange={() => this.toggleComplete(notification.notification_id)} />
                </label>
                {notification.message_type == 'REMINDER' ?
                  <div className="todo-content blue-color">Pending submission on {moment(notification.date1).format('DD-MM-YYYY')}</div>
                : notification.message_type == 'UNLOCK' ?
                  <div className="todo-content blue-color">Unlocked submission on {moment(notification.date1).format('DD-MM-YYYY')}</div>
                : notification.message_type == 'APPROVE' ?
                  <div className="todo-content blue-color">Approved submission on {moment(notification.date1).format('DD-MM-YYYY')}</div>
                : null
                }
                {this.state.user.role != 'CONSULTANT' ?
                  <a onClick={() => this.deletenotification(notification.notification_id)}>
                    &times;
                  </a>
                : null}
              </div>
            </div>
          ))}
          </form>
        </div>
        <div className="footer">
          <hr />
          <div className="stats">
            <i className="fa fa-history"></i> Updated 3 minutes ago
              </div>
        </div>
      </div>
    );
  }
}

export default Tasks;
