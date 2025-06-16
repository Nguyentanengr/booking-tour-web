// fakeBookings.js
export const mockTours = [
  { _id: "t1343434", name: "Hà Nội - Hạ Long 3 ngày 2 đêm", tour_code: "HN-HL-01" },
  { _id: "t2343435", name: "Hà Nội - Đà Nẵng 4 ngày 3 đêm", tour_code: "HN-DN-01" },
  { _id: "t3764643", name: "Hồ Chí Minh - Phú Quốc 5 ngày 4 đêm", tour_code: "HCM-PQ-01" },
];

export const mockDepartures = [
  { _id: "d1353454", departure_date: "2025-06-01", return_date: "2025-06-03" },
  { _id: "d2768566", departure_date: "2025-06-15", return_date: "2025-06-17" },
  { _id: "d3344324", departure_date: "2025-07-01", return_date: "2025-07-04" },
];

export const mockBookings = [
  {
    _id: "b16756545",
    user: { user_id: "u1", name: "Nguyễn Văn A" },
    tour_id: "t1343434",
    departure_id: "d1353454",
    passengers: [
      { full_name: "Nguyễn Văn A", date_of_birth: "1990-01-01", gender: "Male", phone_number: "0901234567", type: "adult", price: 3500000 },
      { full_name: "Nguyễn Thị B", date_of_birth: "1992-05-15", gender: "Female", phone_number: "0907654321", type: "adult", price: 3500000 },
    ],
    additional_services: [{ service_id: "SV_01", name: "Hướng dẫn viên tiếng Việt", price: 500000, quantity: 1 }],
    total_price: 7500000,
    status: "confirmed",
    booking_date: "2025-05-21T23:00:00Z",
  },
  {
    _id: "b24654675",
    user: { user_id: "u2", name: "Trần Văn C" },
    tour_id: "t2343435",
    departure_id: "d2768566",
    passengers: [{ full_name: "Trần Văn C", date_of_birth: "1985-08-20", gender: "Male", phone_number: "0912345678", type: "adult", price: 6800000 }],
    additional_services: [],
    total_price: 6800000,
    status: "pending_payment",
    booking_date: "2025-05-20T15:30:00Z",
  },
  {
    _id: "b34678536",
    user: { user_id: "u3", name: "Lê Thị D" },
    tour_id: "t3764643",
    departure_id: "d3344324",
    passengers: [
      { full_name: "Lê Thị D", date_of_birth: "1988-12-10", gender: "Female", phone_number: "0923456789", type: "adult", price: 8800000 },
      { full_name: "Lê Văn E", date_of_birth: "2015-03-25", gender: "Male", phone_number: "0923456789", type: "child", price: 4400000 },
    ],
    additional_services: [{ service_id: "SV_02", name: "Bảo hiểm du lịch", price: 200000, quantity: 2 }],
    total_price: 13600000,
    status: "cancelled",
    booking_date: "2025-05-19T10:15:00Z",
  },
];

export const mockServices = [
    { service_id: "SV_01", name: "Hướng dẫn viên tiếng Việt", price: 500000 },
    { service_id: "SV_02", name: "Bảo hiểm du lịch", price: 200000 },
    { service_id: "SV_03", name: "Vé tham quan đặc biệt", price: 300000 },
];