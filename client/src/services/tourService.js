import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const tourService = {

    getPopularTours: async (provincesData) => { // Nhận thêm provincesData để map tên tỉnh
        try {
            const response = await axios.get(`${API_BASE_URL}/tours/popular`);
            const apiData = response.data; // Dữ liệu từ API

            // Hàm giúp tìm tên tỉnh từ mô tả của tỉnh
            const getProvinceNameFromDescription = (description, regions) => {
                if (!regions || !description) return description; // Trả về mô tả nếu không có dữ liệu hoặc mô tả

                for (const region of regions) {
                    for (const province of region.provinces) {
                        // So sánh mô tả từ API với mô tả trong dữ liệu tỉnh thành
                        // Hoặc so sánh dựa trên một phần của mô tả, tùy độ chính xác
                        if (province.description && description.includes(province.description)) {
                            return province.name; // Trả về tên tỉnh
                        }
                    }
                }
                return description; // Nếu không tìm thấy, trả về mô tả gốc
            };

            const formattedData = apiData.map(tour => ({
                id: tour._id, // API có _id, dùng làm id
                name: tour.name,
                tourCode: tour.tourCode,
                // Chú ý: API trả về mô tả, fake data muốn tên tỉnh.
                // Cố gắng map mô tả sang tên tỉnh nếu có provincesData
                startingProvince: getProvinceNameFromDescription(tour.startingProvince, provincesData),
                destinationProvince: getProvinceNameFromDescription(tour.destinationProvince, provincesData),
                duration: tour.duration,
                transportation: null, // Không có trong API, đặt null hoặc giá trị mặc định
                price: tour.representativePrice?.adult || 0, // Giá người lớn
                discountedPrice: tour.representativePrice?.discountedPrice || null, // Giá ưu đãi
                image: tour.images && tour.images.length > 0
                    ? `https://your-image-base-url/${tour.images[0]}` // Giả định có base URL cho ảnh tours
                    : "/placeholder.svg?height=200&width=400", // Placeholder nếu không có ảnh
                isBestseller: tour.isBestseller,
                departureDates: [], // Không có trong API, đặt rỗng hoặc giá trị mặc định
            }));

            return formattedData;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu tour phổ biến:', error.response?.status, error.response?.data || error.message);
            throw error;
        }
    },

    fetchTours : async ({ searchTerm, sortBy, filters, page, limit }) => {
    try {
    const queryParams = new URLSearchParams();

    // Thêm các tham số phân trang
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    // Thêm thuật ngữ tìm kiếm nếu có
    if (searchTerm) {
      queryParams.append('search', searchTerm);
    }

    // Ánh xạ các bộ lọc từ frontend sang tham số query của backend
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (!isNaN(min)) queryParams.append('minPrice', min);
      if (!isNaN(max)) queryParams.append('maxPrice', max);
    }
    if (filters.duration) {
      queryParams.append('duration', filters.duration);
    }
    if (filters.startingProvince) {
      queryParams.append('startingProvince', filters.startingProvince);
    }
    if (filters.destination) { // Giả định 'destination' ở frontend tương ứng với 'destinationProvince' ở backend
      queryParams.append('destinationProvince', filters.destination);
    }
    if (filters.transportation) {
      queryParams.append('transportation', filters.transportation);
    }
    if (filters.rating) { // Giả định 'rating' ở frontend là 'minRating' ở backend
      queryParams.append('minRating', filters.rating);
    }
    if (filters.bestsellerOnly) {
      queryParams.append('isBestseller', 'true');
    }
    // Nếu bạn có lọc theo ngày khởi hành ở backend, thêm vào đây:
    // if (filters.departureDate) {
    //   queryParams.append('departureDate', filters.departureDate.toISOString());
    // }

    // Ánh xạ tham số sắp xếp từ frontend sang backend
    let backendSortBy = '';
    let backendOrder = '';

    switch (sortBy) {
      case 'price-asc':
        backendSortBy = 'price';
        backendOrder = 'asc';
        break;
      case 'price-desc':
        backendSortBy = 'price';
        backendOrder = 'desc';
        break;
      case 'name-asc':
        backendSortBy = 'name';
        backendOrder = 'asc';
        break;
      case 'name-desc':
        backendSortBy = 'name';
        backendOrder = 'desc';
        break;
      case 'rating': // Mặc định sắp xếp đánh giá cao nhất trước
        backendSortBy = 'rating';
        backendOrder = 'desc';
        break;
      case 'newest': // Đây là trường hợp mặc định của backend (createdAt -1)
      default:
        break;
    }

    if (backendSortBy) {
      queryParams.append('sortBy', backendSortBy);
    }
    if (backendOrder) {
      queryParams.append('order', backendOrder);
    }

    const apiUrl = `${API_BASE_URL}/tours?${queryParams.toString()}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi HTTP! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      tours: data.tours,
      totalTours: data.totalTours,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tour từ API:", error);
    throw error;
  }
}
};

