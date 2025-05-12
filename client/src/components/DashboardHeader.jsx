import React from 'react';

const DashboardHeader = () => (
    <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow w-full fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
            {/* Placeholder for user info or actions */}
            <span className="font-medium">Admin</span>
        </div>
    </header>
);

export default DashboardHeader;