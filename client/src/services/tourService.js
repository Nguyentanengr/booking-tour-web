import axios from "axios";
import { fakeTours } from '../utils/fakeDate';


const API_URL = 'https://api.example.com/tours';

// export const fetchTours = async () => {
//     try {
//         const response = await axios.get(API_URL);
//         return response;
//     } catch (error) {
//         throw new Error('Error fetching tours');
//     }
// };

// fake


export const fetchTours = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeTours);
    }, 1500); // Giả lập việc fetch dữ liệu với delay 1.5 giây
  });
};
