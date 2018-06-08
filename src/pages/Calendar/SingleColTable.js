import React from 'react';

const SingleColTable = ({data}) => (
  <div className="card-table">
    <div className="header">

    </div>
    <div className="table-responsive table-full-width">
      <table className="table table-striped">
        <thead>
          <tr>
            <th className='table-date'>Dates</th>
            <th className='table-date'>24-04-2018</th>
            <th className='table-date'>25-04-2018</th>
            <th className='table-date'>26-04-2018</th>
            <th className='table-date'>27-04-2018</th>
            <th className='table-date'>28-04-2018</th>
            <th className='table-date'>29-04-2018</th>
            <th className='table-date'>30-04-2018</th>
            <th className='table-date'></th>

          </tr>
        </thead>

      </table>

    </div>
  </div>
);

export default SingleColTable;
