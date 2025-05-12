import React from 'react';
import { NavLink } from 'react-router-dom';


const DashboardSidebar = () => (
    <aside
        className="bg-gray-800 text-white w-64 min-h-screen space-y-6"
    >
        <nav className="flex flex-col space-y-4">
            <NavLink
                to="/dashboard/manage-tours"
                className={({ isActive }) =>
                    isActive
                        ? 'bg-gray-700 rounded px-3 py-2 font-semibold'
                        : 'hover:bg-gray-700 rounded px-3 py-2'
                }
            >
                Manage Tours
            </NavLink>
            <NavLink
                to="/dashboard/revenue"
                className={({ isActive }) =>
                    isActive
                        ? 'bg-gray-700 rounded px-3 py-2 font-semibold'
                        : 'hover:bg-gray-700 rounded px-3 py-2'
                }
            >
                Revenue
            </NavLink>
        </nav>
    </aside>
);

export default DashboardSidebar;