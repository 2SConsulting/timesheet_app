import React from 'react';
import GridCollection from './GridCollection';
import Paragraph from './Paragraph';
import { Tabs, Tab } from 'react-bootstrap';
import PlainBackgroundTable from './PlainBackgroundTable';
import generateData from './generateData.js';
import FormElements from './FormElements';
import {Typeahead} from 'react-bootstrap-typeahead'; // ES2015
import Documents from './documents';
import GeneralInfo from './GeneralInfo';

const data = generateData(15);

const Details = () => (
  <div className="content">
    <div className="row container-fluid">
      <div className="col-md-12">
        <div className="card">
            <div className='height-100'>
            <div className="header float-left">
              <h4 className="title">Sample Project 1</h4>
              <p className="category">Sample Project 1 Description</p>
            </div>

            <div className="float-right margin-20">
              <button type="button" className="btn btn-wd btn-success">
                <span className="btn-label">
                  <i className="fa fa-check"></i>
                </span> Close Project
              </button>
            </div>
          </div>
          <div className="content content-full-width">
            <Tabs defaultActiveKey={1} id="tab-with-icons">
              <Tab eventKey={1} title={<span><i className="fa fa-info"></i> General Info</span>}>
                <div className="row">
                  <div className="col-md-12">
                    <GeneralInfo />
                  </div>
                </div>
              </Tab>
              <Tab eventKey={2} title={<span><i className="fa fa-user"></i> Team & Timeline</span>}>
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      <Typeahead
                        allowNew
                        multiple
                        newSelectionPrefix="Add a new item: "
                        options={['First User', 'Second User', 'Third User', 'Fourth User', 'Fifth User']}
                        placeholder="Add Team Members"
                      />
                    </div>
                    <div className="col-md-6">
                      <FormElements initialValues={{
                        radioGroup: 'male',
                        a: true,
                        checked: true,
                        disabledChecked: true,
                        radioOnOff: 'on',
                        radioDisabledOnOff: 'on'
                      }} />
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey={3} title={<span><i className="fa fa-cube"></i> Documents</span>}><Documents /></Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Details;
