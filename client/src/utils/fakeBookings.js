// src/utils/fakeBookings.js
import { addDays } from 'date-fns';

export const mockBookings = [
  {
    _id: "booking_001",
    departure_id: "89012347", // Matches a departure in fakeDepartures
    customer_name: "Nguyễn Văn A",
    customer_phone: "0901234567",
    customer_email: "nguyenvana@example.com",
    adults: 2,
    children: 1,
    seniors: 0,
    total_price: 3500000,
    booking_date: new Date('2025-06-01T10:00:00Z'),
    status: "confirmed", // confirmed, pending, cancelled
  },
  {
    _id: "booking_002",
    departure_id: "89012347",
    customer_name: "Trần Thị B",
    customer_phone: "0918765432",
    customer_email: "tranthib@example.com",
    adults: 1,
    children: 0,
    seniors: 1,
    total_price: 2800000,
    booking_date: new Date('2025-06-05T11:30:00Z'),
    status: "pending",
  },
  {
    _id: "booking_003",
    departure_id: "89012347", // Matches another departure
    customer_name: "Lê Văn C",
    customer_phone: "0987654321",
    customer_email: "levanc@example.com",
    adults: 3,
    children: 0,
    seniors: 0,
    total_price: 4500000,
    booking_date: new Date('2025-06-10T14:00:00Z'),
    status: "confirmed",
  },
  {
    _id: "booking_004",
    departure_id: "89012347",
    customer_name: "Phạm Thị D",
    customer_phone: "0976543210",
    customer_email: "phamthid@example.com",
    adults: 1,
    children: 2,
    seniors: 0,
    total_price: 4000000,
    booking_date: new Date('2025-06-03T09:00:00Z'),
    status: "cancelled",
  },
  // Add more mock bookings as needed
  {
    _id: "booking_005",
    departure_id: "89012347",
    customer_name: "Hoàng Văn E",
    customer_phone: "0965432109",
    customer_email: "hoangvane@example.com",
    adults: 2,
    children: 0,
    seniors: 0,
    total_price: 3000000,
    booking_date: new Date('2025-06-12T16:00:00Z'),
    status: "confirmed",
  },
];