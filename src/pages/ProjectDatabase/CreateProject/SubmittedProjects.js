import React from 'react';
import $ from 'jquery'

class SubmittedProjects extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: []
    }

    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  componentDidMount() {
    this.ProjectList();
  }

  forceUpdateHandler(){
    console.log('calling project list again')
   this.ProjectList();
 };

  ProjectList() {
    $.getJSON('https://97h10a54x9.execute-api.eu-central-1.amazonaws.com/stage_project_list')
      .then(({ body }) => {
        this.setState({ projects: body });
      });
  }

  render() {
    return (
      <div>
        <div className="header text-center">
          <span className="heading margin-10">Existing Projects</span>
          <i onClick={this.forceUpdateHandler} className="cursor-pointer padding-right-10 fa fa-refresh"></i>
        </div>

        <div className="content table-responsive table-full-width">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Project Code</th>
                <th>Country</th>
                <th>Client Name</th>
                <th>Approver</th>
                <th>Project Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {this.state.projects.map(project => (
              <tr key={project.proj_code}>
                <td>{project.proj_code}</td>
                <td>{project.country}</td>
                <td>{project.customer_name}</td>
                <td>{project.employee_name}</td>
                <td>{project.title}</td>
                <td>{project.status ? project.status : 'Pending'}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default SubmittedProjects;
