import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import GeneralInfo from './GeneralInfo';
import Team from './Team';
import Docs from './Docs';

const Project = ({project, country, client, user}) => (
  <div className="content">
    <div>
        <div>
          <div className='height-50'>
            <div className="header">
              <p className='heading'>{project.title} - {project.proj_code}</p>
            </div>
          </div>
          <div className="content content-full-width">
            <Tabs defaultActiveKey={1} id="tab-with-icons">
              <Tab eventKey={1} title={<span><i className="fa fa-info"></i> General Info</span>}>
                <div className="row">
                  <div className="col-md-12">
                    <GeneralInfo project={project} user={user} />
                  </div>
                </div>
              </Tab>
              <Tab eventKey={2} title={<span><i className="fa fa-user"></i> Team</span>}>
                  <div className="row">
                    <div className="col-md-12">
                      <Team projectCode={project.proj_code} user={user} />
                    </div>
                  </div>
              </Tab>
              <Tab eventKey={3} title={<span><i className="fa fa-cube"></i> Documents</span>}>
                <Docs />
              </Tab>
            </Tabs>
          </div>
        </div>
    </div>
  </div>
)

export default Project;
