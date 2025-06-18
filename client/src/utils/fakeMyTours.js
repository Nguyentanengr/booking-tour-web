
const myToursData = {
  upcoming: [
    {
      id: "upc1",
      name: "Hà Nội - Hạ Long - Ninh Bình",
      tourCode: "HN567",
      departureDate: new Date(2024, 5, 10), // Month is 0-indexed, so 5 is June
      returnDate: new Date(2024, 5, 15),
      duration: "5N4Đ",
      transportation: "Máy bay",
      price: 8990000,
      status: "confirmed",
      image: "https://photo.znews.vn/w1920/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
      passengers: 2,
    },
    {
      id: "upc2",
      name: "Đà Nẵng - Hội An",
      tourCode: "DN123",
      departureDate: new Date(2024, 6, 20),
      returnDate: new Date(2024, 6, 24),
      duration: "4N3Đ",
      transportation: "Tàu hỏa",
      price: 4500000,
      status: "pending",
      image: "https://vnn-res.vn/image/da-nang-hoi-an-du-lich.jpeg",
      passengers: 3,
    },
  ],
  completed: [
    {
      id: "cmp1",
      name: "Phú Quốc - Thiên đường biển đảo",
      tourCode: "PQ234",
      departureDate: new Date(2024, 2, 15),
      returnDate: new Date(2024, 2, 19),
      duration: "4N3Đ",
      transportation: "Máy bay",
      price: 6590000,
      status: "completed",
      image: "https://photo.znews.vn/w1920/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
      passengers: 2,
      rating: 5,
    },
  ],
  cancelled: [
    {
      id: "cnl1",
      name: "Đà Nẵng - Hội An - Huế",
      tourCode: "DN789",
      departureDate: new Date(2024, 3, 20),
      returnDate: new Date(2024, 3, 24),
      duration: "4N3Đ",
      transportation: "Máy bay",
      price: 5790000,
      status: "cancelled",
      image: "https://photo.znews.vn/w1920/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
      passengers: 2,
      cancelDate: new Date(2024, 3, 15),
      refundAmount: 4632000, // 80% of 5790000
    },
  ],
};

// Simulate API call with a delay
const simulateApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500); // Simulate network delay
  });
};

export const fetchUpcomingTours = () => {
  return simulateApiCall(myToursData.upcoming);
};

export const fetchCompletedTours = () => {
  return simulateApiCall(myToursData.completed);
};

export const fetchCancelledTours = () => {
  return simulateApiCall(myToursData.cancelled);
};

export const fetchAllTours = async () => {
  const [upcoming, completed, cancelled] = await Promise.all([
    fetchUpcomingTours(),
    fetchCompletedTours(),
    fetchCancelledTours(),
  ]);
  return { upcoming, completed, cancelled };
};