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
};