import React from 'react';
import EmailChart from './EmailChart';
import SalesChart from './SalesChart';
import UserBehaviorChart from './UserBehaviorChart';
import Tasks from './Tasks';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.user != this.props.user)
      this.setState({user: nextProps.user})
  }

  render() {
    return (
      <div className="content header-margin">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <UserBehaviorChart />
            </div>
            <div className="col-md-6">
              <Tasks user={this.state.user} />
            </div>
          </div>

        </div>
      </div>
    )
  }
};

export default Dashboard;
