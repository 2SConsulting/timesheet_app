import React from "react";
import { render } from "react-dom";
import { makeData } from "./utils";
import Datepicker from './DatePicker';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import SingleColTable from './SingleColTable';

<SingleColTable/>
class Table extends React.Component {

  constructor() {
    super();
    this.state = {
      data: makeData()
    };
    this.renderEditable = this.renderEditable.bind(this);
  }
  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa", textAlign: "center" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }
  render() {
    const { data } = this.state;
    return (
    <div className="card">
      <div className="content">
        <div className="header text-center">
          <h4>Timesheet Entry</h4>
        </div>
        <div className="margin-20">
          <Datepicker/>
        </div>
        <ReactTable
          data={data}

          columns={[
            {
              Header: "Time",
              columns: [
                {
                  Header: "Charge Code",
                  accessor: "charge",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Monday",
              columns: [
                {
                  Header: "23-04-18",
                  accessor: "monday",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Tuesday",
              columns: [
                {
                  Header: "24-04-18",
                  accessor: "tuesday",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Wednesday",
              columns: [
                {
                  Header: "25-04-18",
                  accessor: "wednesday",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Thursday",
              columns: [
                {
                  Header: "26-04-18",
                  accessor: "thursday",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Friday",
              columns: [
                {
                  Header: "27-04-18",
                  accessor: "friday",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Saturday",
              columns: [
                {
                  Header: "28-04-18",
                  accessor: "saturday",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Sunday",
              columns: [
                {
                  Header: "29-04-18",
                  accessor: "sunday",
                  Cell: this.renderEditable
                }
              ]
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
      </div>
      <div className="footer text-center margin-bottom-20">
      <button type="button" className="btn btn-rectangle btn-wd btn-info">
        <span className="btn-label">
        </span> Search
      </button>
      </div>
    </div>
    );
  }
}

export default Table;
