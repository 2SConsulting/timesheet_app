/* eslint-disable no-alert */
import React from 'react';
import {Dashboard, Header, Sidebar} from '../../components/AdminDashboard';
import Dashboard1 from '../Dashboard';

const logoLg =
            <p>
              <p className="logo-title">Integrated Health Solutions</p>
              <p className="logo-subtitle">Consulting Business Management Platform</p>
            </p>
const logoSm = <span>IHS</span>

const navMenu = (user) => ([
  <Header.UserMenu
    name={user.name}
    image="https://github.com/zksailor534/react-adminlte-dash/blob/master/public/user2-160x160.jpg?raw=true"
    profileAction={() => alert('Access profile')}
    signOutAction={() => window.location.reload()}
    key="2"
  />
]);

const sb = (navigateTo, user) => ([
  <Sidebar.Menu className="fixed-position cursor-pointer" key="3">
    <Sidebar.Menu.Item onClick={() =>  navigateTo("Dashboard")} icon={{ className: 'fa-dashboard' }} title="Dashboard" >
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon={{ className: 'fa-files-o' }} title="Project Database" >
      <Sidebar.Menu.Item icon={{ className: 'fa-plus-square' }} onClick={() =>  navigateTo("CreateProject")} title="Create Project" />
      <Sidebar.Menu.Item icon={{ className: 'fa-info-circle' }} onClick={() =>  navigateTo("ProjectDetails")} title="Project Details" />
      <Sidebar.Menu.Item icon={{ className: 'fa-search' }} onClick={() =>  navigateTo("Documents")} title="Search Documents" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon={{ className: 'fa-calendar' }} title="TTM" >
      <Sidebar.Menu.Item icon={{ className: 'fa-hourglass' }} onClick={() =>  navigateTo("Timesheet")} title="Timesheet" />
      <Sidebar.Menu.Item icon={{ className: 'fa-sign-in' }} onClick={() =>  navigateTo("Submissions")} title="Manage Submissions" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon={{ className: 'fa-gamepad' }} title="Control Setup" >
      <Sidebar.Menu.Item icon={{ className: 'fa-asterisk' }} onClick={() =>  navigateTo("ManageControlData")} title="Manage Control Data" />
      <Sidebar.Menu.Item icon={{ className: 'fa-refresh' }} onClick={() =>  navigateTo("DataSyncForSAP")} title="Data Sync For SAP" />
      <Sidebar.Menu.Item icon={{ className: 'fa-upload' }} onClick={() =>  navigateTo("DataUploadFromSAP")} title="Data Upload From SAP" />
      <Sidebar.Menu.Item icon={{ className: 'fa-users' }} onClick={() =>  navigateTo("UserManagement")} title="User Management" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon={{ className: 'fa-chart-pie' }} onClick={() =>  navigateTo("Reporting")} icon={{ className: 'fa-edit' }} title="Reporting" >
    </Sidebar.Menu.Item>
  </Sidebar.Menu>
]);

const footer = () => ([
    <span>Copyright � 2018 . 2S Consulting . All rights reserved.</span>,
]);

const Layout = ({ children, theme, navigateTo, user }) => (
  <Dashboard
    icon={{color: '#00000' }}
    navbarChildren={navMenu(user)}
    sidebarChildren={sb(navigateTo, user)}
    footerChildren={footer()}
    sidebarMini
    theme={theme}
    logoLg={logoLg}
    logoSm={logoSm}
    initialCollapse={false}
  >
    {children}
  </Dashboard>
);

Layout.propTypes = {
  children: React.PropTypes.node,
  navigateTo: React.PropTypes.func,
  theme: React.PropTypes.string,
};

export default Layout;
