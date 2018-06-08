import React from 'react';

let data = [
  {id: 1, key: "Project Title", value: "Sample Value"},
  {id: 2, key: "Project Status", value: "Sample Value"},
  {id: 3, key: "IHS Project Lead", value: "Sample Value"},
  {id: 4, key: "Cross-charging", value: "Sample Value"},
  {id: 5, key: "Cost center for cross-charging", value: "Sample Value"},
  {id: 6, key: "Approver / cost center owner", value: "Sample Value"},
  {id: 7, key: "Approval status", value: "Sample Value"},
  {id: 8, key: "Written approval", value: "Sample Value"},
  {id: 9, key: "Project Code", value: "Sample Value"},
  {id: 10, key: "IHS BD lead", value: "Sample Value"},
  {id: 11, key: "IHS Project Team members", value: "Sample Value"},
  {id: 12, key: "IHS Service Line", value: "Sample Value"},
  {id: 13, key: "Medtronic BU involved", value: "Sample Value"},
  {id: 14, key: "Objectives", value: "Sample Value"},
  {id: 15, key: "Specialty", value: "Sample Value"},
  {id: 16, key: "Department", value: "Sample Value"}
]

const PlainBackgroundTable = ({}) => (
  <div className="card card-plain">
    <div className="content table-responsive table-full-width">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.key}</td>
            <td>{item.value}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PlainBackgroundTable;
