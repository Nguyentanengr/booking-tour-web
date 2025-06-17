import React from 'react';
import UserHeader  from '../components/user/UserHeader';
import UserFooter from '../components/user/UserFooter';
import ContactButton from '../components/user/ContactButton';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="bg-white">
      <UserHeader />
      <main className="min-h-screen">
        <Outlet /> {/* Đây là nơi nội dung động sẽ hiển thị */}
      </main>
      <UserFooter />
      <ContactButton />
    </div>
  );
};

export default UserLayout;