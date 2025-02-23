import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {data ? (
        <div className="cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>{data.total_users}</p>
          </div>
          <div className="card">
            <h3>Active Users</h3>
            <p>{data.active_users}</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>${data.revenue}</p>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Dashboard;