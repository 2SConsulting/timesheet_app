import React from 'react';
import generateData from './generateData';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';

const data = generateData(10);

const BigTable = () => (
  <div>
    <div className="header text-center">
      <h4 className="title">Document List</h4>
      <p className="category">Documents matching the search criteria</p>
      <br />
    </div>
    <div className="content table-responsive table-full-width">
      <table className="table table-bigboy">
        <thead>
          <tr>
            <th>Client Name</th>
            <th className="th-description">Document Filename</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr>
              <td className="td-name">
                {item.name}
              </td>
              <td>
                {item.description}
              </td>
              <td className="td-number">{moment(item.birthdate).format('YYYY-MM-DD')}</td>
              <td className="td-actions">
                <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-info btn-simple btn-icon" data-original-title="View Post">
                  <i className="fa fa-image"></i>
                </button>
                <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-success btn-simple btn-icon" data-original-title="Edit Post">
                  <i className="fa fa-download"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default BigTable;
