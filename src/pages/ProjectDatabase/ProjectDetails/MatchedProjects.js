import React from 'react';
import $ from 'jquery'

class MatchedProjects extends React.Component {
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
                <td className="td-actions">
                  <button onClick={() =>  openProject(item.name)} type="button" rel="tooltip" data-placement="left" title="" className="btn btn-info btn-simple btn-icon" data-original-title="View Post">
                    <i className="fa fa-image"></i>
                  </button>
                  <Link to="/components/details">
                  <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-success btn-simple btn-icon" data-original-title="Edit Post">
                    <i className="fa fa-edit"></i>
                  </button>
                  </Link>
                  <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                    <i className="fa fa-times"></i>
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default MatchedProjects;
