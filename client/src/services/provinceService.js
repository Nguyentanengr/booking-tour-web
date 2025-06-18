import axios from 'axios';

// Định nghĩa Base URL ngay tại đây cho sự đơn giản.
// Trong một ứng dụng lớn hơn, bạn nên đặt nó trong biến môi trường (.env)
const API_BASE_URL = 'http://localhost:3000/api/v1';

export const provinceService = {

    getProvincesByRegion: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/provinces`);
            const apiData = response.data; // Dữ liệu từ API
            console.log(apiData)
            const formattedData = apiData.map((region, index )=> ({
                id:  index,// Ví dụ: "mien-bac"
                name: region.region,
                provinces: region.provinces.map(province => ({
                    id: province._id.toLowerCase().replace(/\s/g, '-').replace(/\./g, ''), 
                    name: province._id,
                    description: province.description,
                    image: province.images[0],
                })),
            }));

            return formattedData;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu tỉnh thành:', error.response?.status, error.response?.data || error.message);
            throw error;
        }
    },
};

