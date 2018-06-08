import React from 'react';
import GridCollection from './GridCollection';
import Paragraph from './Paragraph';
import { Tabs, Tab } from 'react-bootstrap';
import PlainBackgroundTable from './PlainBackgroundTable';
import generateData from './generateData.js';
import FormElements from './FormElements';
import {Typeahead} from 'react-bootstrap-typeahead'; // ES2015

const data = generateData(15);

const Grid = () => (
  <div className="content">
    <div className="row container-fluid">
      <div className="col-md-12">
        <div className="card">
          <div className="header">
            <h4 className="title">Sample Project 1</h4>
            <p className="category">Sample Project 1's Description</p>
          </div>
          <div className="content content-full-width">
            <Tabs defaultActiveKey={1} id="tab-with-icons">
              <Tab eventKey={1} title={<span><i className="fa fa-info"></i> General Info</span>}>
                <div className="row">
                  <div className="col-md-12">
                    <PlainBackgroundTable />
                  </div>
                </div>
              </Tab>
              <Tab eventKey={2} title={<span><i className="fa fa-user"></i> Team & Timeline</span>}>
                <div>
                  <Typeahead
                    allowNew
                    multiple
                    newSelectionPrefix="Add a new item: "
                    options={['First User', 'Second User', 'Third User', 'Fourth User', 'Fifth User']}
                    placeholder="Add Team Members"
                  />
                  <div className="row">
                    <div className="col-md-12">
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
              <Tab eventKey={3} title={<span><i className="fa fa-cube"></i> Documents</span>}>Explore a wide variety of styles, personalise your finishes, and let us design the perfect home for you. It's what we do best and you can see proof in the products and reviews below.</Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Grid;
