import React from 'react';

let data = [
  {id: 1, key: "Project Title", value: "Sample Value", status: "Approved"},
  {id: 2, key: "Project Status", value: "Sample Value", status: "Approved"},
  {id: 3, key: "IHS Project Lead", value: "Sample Value", status: "Approved"},
  {id: 4, key: "Cross-charging", value: "Sample Value", status: "Approved"},
  {id: 5, key: "Cost center for cross-charging", value: "Sample Value", status: "Approved"},
  {id: 6, key: "Approver / cost center owner", value: "Sample Value", status: "Approved"},
  {id: 7, key: "Approval status", value: "Sample Value", status: "Approved"},
  {id: 8, key: "Written approval", value: "Sample Value", status: "Approved"},
  {id: 9, key: "Project Code", value: "Sample Value", status: "Approved"},
  {id: 10, key: "IHS BD lead", value: "Sample Value", status: "Approved"},
  {id: 11, key: "IHS Project Team members", value: "Sample Value", status: "Approved"},
  {id: 12, key: "IHS Service Line", value: "Sample Value", status: "Approved"},
  {id: 13, key: "Medtronic BU involved", value: "Sample Value", status: "Approved"},
  {id: 14, key: "Objectives", value: "Sample Value", status: "Approved"},
  {id: 15, key: "Specialty", value: "Sample Value", status: "Approved"},
  {id: 16, key: "Department", value: "Sample Value", status: "Approved"}
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
