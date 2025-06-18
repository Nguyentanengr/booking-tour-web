
/**
 * Giả lập gửi dữ liệu liên hệ đến một API backend.
 * @param {object} formData - Dữ liệu form cần gửi.
 * @returns {Promise<object>} - Trả về một Promise với kết quả thành công hoặc lỗi.
 */
export const submitContactForm = (formData) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        console.log("Mock API: Dữ liệu liên hệ đã được gửi:", formData);
        resolve({ success: true, message: "Gửi liên hệ thành công!" });
      } else { // 10% failure rate
        reject({ success: false, message: "Đã xảy ra lỗi khi gửi liên hệ. Vui lòng thử lại sau." });
      }
    }, 1500); // Simulate 1.5 seconds network latency
  });
};