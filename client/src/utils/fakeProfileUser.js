// Mock initial user data
let mockUserData = {
  fullName: "Nguyễn Văn A",
  gender: "male",
  email: "nguyenvana@gmail.com",
  phone: "0912345678",
  avatarUrl: "https://dulichsaigon.edu.vn/wp-content/uploads/2024/01/tim-hieu-dinh-nghia-du-lich-va-cac-loai-hinh-du-lich.jpg",
  birthDate: new Date(1990, 0, 1), // Using Date object
};

// Mock password for validation
const mockCurrentPassword = "password123";

const simulateApiCall = (data, successMessage, errorMessage, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail || Math.random() < 0.1) { // Simulate 10% failure rate
        reject({
          message: errorMessage || "Lỗi không xác định từ server."
        });
      } else {
        resolve({
          message: successMessage,
          data: data
        });
      }
    }, 1000); // Simulate network delay
  });
};

export const fetchUserProfile = async () => {
  console.log("Mock API: Fetching user profile...");
  return simulateApiCall({ ...mockUserData }, "Lấy thông tin profile thành công!");
};

export const updateProfile = async (profileData) => {
  console.log("Mock API: Updating profile with data:", profileData);
  mockUserData = { ...mockUserData, ...profileData }; // Update mock data
  return simulateApiCall({ ...mockUserData }, "Cập nhật thông tin thành công!");
};

