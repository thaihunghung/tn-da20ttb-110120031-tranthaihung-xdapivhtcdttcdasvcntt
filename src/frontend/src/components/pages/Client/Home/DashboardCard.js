import React from 'react';

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg flex items-center shadow-md">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <h3 className="text-2xl font-semibold">{value}</h3>
        <p className="text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
