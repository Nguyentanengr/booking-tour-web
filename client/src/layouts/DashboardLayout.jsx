import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import DashboardSidebar from '../components/DashboardSidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => (
  <div className="flex min-h-screen bg-gray-100">
    <DashboardSidebar />
    <div className="flex-1 flex flex-col pl-64">
      <DashboardHeader />
      <main className="flex-1 mt-16 bg-white">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;