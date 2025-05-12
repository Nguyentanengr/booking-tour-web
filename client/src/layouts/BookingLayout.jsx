import React from 'react';
import { Outlet } from 'react-router-dom';
import BookingHeader from '../components/BookingHeader';
import BookingFooter from '../components/BookingFooter';

const BookingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <BookingHeader />
      <main className="flex-grow">
        <Outlet /> {/* Đây là nơi nội dung động sẽ hiển thị */}
      </main>
      <BookingFooter />
    </div>
  );
};

export default BookingLayout;
