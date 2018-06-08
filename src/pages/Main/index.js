import React from 'react';
import { Route, Router } from 'react-router-dom';
import { connect } from 'react-redux';
import cx from 'classnames';
import { setMobileNavVisibility } from '../../reducers/Layout';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Header from './Header';
import Footer from './Footer';
import Layout from './Layout.js';
import SideBar from '../../components/SideBar';
import ThemeOptions from '../../components/ThemeOptions';
import MobileMenu from '../../components/MobileMenu';
/**
 * Pages
 */
import Dashboard from '../Dashboard';
import CreateProject from '../ProjectDatabase/CreateProject';
import ProjectDetails from '../ProjectDatabase/ProjectDetails';
import Project from '../ProjectDatabase/ProjectDetails/Project';
import Timesheet from '../TTM/Timesheet';
import Submissions from '../TTM/Submissions';
import ManagePostings from '../TTM/ManagePostings';
import Documents from '../ProjectDatabase/Documents';
import Components from '../Components';
import UserProfile from '../UserProfile';
import MapsPage from '../MapsPage';
import Forms from '../Forms';
import Charts from '../Charts';
import Calendar from '../Calendar';
import Tables from '../Tables';
import swal from 'sweetalert';

class Main extends React.Component {
  constructor() {
    super();
    this.state = { childComponent: null, user: null };
    this.navigateTo = this.navigateTo.bind(this);
  }

  loggedIn(user) {
    this.setState({user});
    this.navigateTo('Dashboard', user)
  }

  openProject(projectId) {
    let childComponent = <Project projectId={projectId} />
    this.setState({childComponent});
  }

  navigateTo(child, user) {
    if (!user) {
      user = this.state.user;
    }
    
    let childComponent = this.state.childComponent;
    if (child == "Dashboard") {
      childComponent = <Dashboard user={this.state.user} />
    } else if (child == "CreateProject") {
      childComponent = <CreateProject className="full-height" />;
    } else if (child == "ProjectDetails") {
      childComponent = <ProjectDetails openProject={this.openProject.bind(this)} user={this.state.user} />
    } else if (child == "Project") {
      childComponent = <Project user={this.state.user} />
    } else if (child == "Documents") {
      //childComponent = <Documents />
      swal('Unavailable', 'This menu is unavailable', 'error');
    } else if (child == "Timesheet") {
      childComponent = <Timesheet user={this.state.user} />
    } else if (child == "Submissions") {
      if (this.state.user.emp_role != 'PROJECT LEAD') {
        swal('Unauthorized', 'You do not have the access for this menu', 'error');
      } else {
        childComponent = <Submissions user={this.state.user} />
      }
    } else if (child == "ManagePostings") {
      childComponent = <ManagePostings />
    } else {
      swal('Unavailable', 'This menu is unavailable', 'error');
    }

    this.setState({childComponent})
  }

  render() {
    return (
      <div>
        {
          !this.state.user ? <Login loggedIn={this.loggedIn.bind(this)}/> : <Layout className="white-scroll" user={this.state.user} children={this.state.childComponent} navigateTo={this.navigateTo.bind(this)} theme={'skin-blue-light'} />
        }
      </div>
    );
  }
}

export default Main;
