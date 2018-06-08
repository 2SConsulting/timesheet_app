import React from 'react';
import generateData from './generateData';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';

const data = generateData(10);

const BigTable = () => (
  <div>
    <div className="header text-center">
      <h4 className="title">Matching Projects</h4>
      <p className="category">Projects matching the search criteria</p>
      <br />
    </div>
    <div className="content table-responsive table-full-width">
      <table className="table table-bigboy">
        <thead>
          <tr>
            <th>Country</th>
            <th className="th-description">Client Name</th>
            <th>Project Name</th>
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
                <Link to="/components/Details">
                <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-info btn-simple btn-icon" data-original-title="View Post">
                  <i className="fa fa-image"></i>
                </button>
                </Link>
                <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-success btn-simple btn-icon" data-original-title="Edit Post">
                  <i className="fa fa-edit"></i>
                </button>
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
);

export default BigTable;
