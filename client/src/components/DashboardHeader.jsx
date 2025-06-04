import React from 'react';

const DashboardHeader = () => (
  <header className="bg-white text-blue-900 px-6 py-4 flex justify-between items-center shadow w-full fixed top-0 left-0 z-10">
    <div className="flex items-center space-x-3">
      <span className="text-2xl font-bold text-blue-600 cursor-pointer">Tour Travel</span>
    </div>
    {/* <div className="bg-amber-500 px-6 py-1 rounded-2xl">
      <span className="text-white font-bold cursor-default">Quản trị viên</span>
    </div> */}
  </header>
);

export default DashboardHeader;