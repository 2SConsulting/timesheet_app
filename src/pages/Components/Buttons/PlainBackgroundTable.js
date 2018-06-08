import React from 'react';

const PlainBackgroundTable = ({data}) => (
  <div className="card card-plain">
    <div className="header">
      <h4 className="title">Submitted Projects</h4>
      <p className="category">This is a list of submitted projects</p>
    </div>
    <div className="content table-responsive table-full-width">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Country Code</th>
            <th>Client Code</th>
            <th>Client Name</th>
            <th>Project Code</th>
            <th>Project Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.country}</td>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.country}</td>
            <td>{item.city}</td>
            <td className="td-actions">
              <button type="button" rel="tooltip" data-placement="left" title="" className="btn btn-danger btn-simple btn-icon " data-original-title="Remove Post">
                <i className="fa fa-check"></i>
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PlainBackgroundTable;
