import React from 'react';

const PlainBackgroundTable = ({data}) => (
  <div className="card card-plain">
    <div className="header">
      <h4 className="title">Existing Projects</h4>
      <p className="category">This is a list of approved projects</p>
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
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PlainBackgroundTable;
