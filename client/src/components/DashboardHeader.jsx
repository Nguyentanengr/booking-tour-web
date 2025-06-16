import React from 'react';
import logo from '../assets/img/logo-dashboard.jpeg';

const DashboardHeader = () => (
  <header className="bg-white text-blue-900 px-6 py-4 flex justify-between items-center shadow w-full fixed top-0 left-0 z-10">
    <div className="flex items-center space-x-2">
      <img src={logo} className='w-10 h-10 cursor-pointer' alt='logo' />
      <span className="text-2xl font-bold font-poppins bg-gradient-to-r from-blue-900 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-text cursor-pointer">
        Administrator
      </span>

      {/* <span className="text-2xl font-bold cursor-pointer font-poppins">Administrator</span> */}
    </div>
    {/* <div className="bg-amber-500 px-6 py-1 rounded-2xl">
      <span className="text-white font-bold cursor-default">Quản trị viên</span>
    </div> */}
  </header>
);

export default DashboardHeader;