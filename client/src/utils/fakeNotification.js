// Mock notifications data
const mockNotifications = [
    {
      id: 1,
      title: "Tour Phú Quốc đã được xác nhận",
      time: "2 giờ trước",
      read: false,
      type: "booking",
      content:
        "Chúng tôi xin thông báo tour Phú Quốc 3N2Đ của bạn đã được xác nhận thành công. Mã đặt tour: PQ2024001. Ngày khởi hành: 15/06/2024. Vui lòng chuẩn bị giấy tờ tùy thân và có mặt tại điểm tập trung trước 30 phút.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Khuyến mãi mùa hè 2024",
      time: "1 ngày trước",
      read: false,
      type: "promotion",
      content:
        "🌞 KHUYẾN MÃI MÙA HÈ 2024 🌞\n\nGiảm ngay 20% cho tất cả tour trong nước!\nÁp dụng từ 01/06 - 31/08/2024\nMã giảm giá: SUMMER2024\n\nĐặt ngay để nhận ưu đãi tốt nhất!",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Thanh toán tour Đà Lạt thành công",
      time: "2 ngày trước",
      read: true,
      type: "payment",
      content:
        "Thanh toán tour Đà Lạt 2N1Đ đã được xử lý thành công.\n\nSố tiền: 2.500.000 VNĐ\nPhương thức: Thẻ tín dụng\nMã giao dịch: PAY2024002\n\nCảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!",
      image: null,
    },
    {
      id: 4,
      title: "Nhắc nhở: Chuẩn bị giấy tờ cho tour Singapore",
      time: "3 ngày trước",
      read: true,
      type: "reminder",
      content:
        "Kính gửi quý khách,\n\nTour Singapore 4N3Đ sẽ khởi hành trong 7 ngày tới. Vui lòng chuẩn bị:\n\n✓ Hộ chiếu còn hạn trên 6 tháng\n✓ Visa Singapore (nếu cần)\n✓ Giấy chứng nhận tiêm chủng\n✓ Bảo hiểm du lịch\n\nLiên hệ hotline nếu cần hỗ trợ!",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "Tour Hạ Long có chương trình khuyến mãi mới",
      time: "4 ngày trước",
      read: true,
      type: "promotion",
      content:
        "🚢 TOUR HẠ LONG ĐẶC BIỆT 🚢\n\nTrải nghiệm du thuyền 5 sao với giá ưu đãi!\nChỉ từ 1.999.000 VNĐ/khách (giá gốc 2.500.000 VNĐ)\n\nBao gồm:\n- Du thuyền 5 sao 2N1Đ\n- Ăn uống cao cấp\n- Kayak, câu cá\n- Tham quan hang động\n\nSố lượng có hạn!",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "Đánh giá tour Nha Trang của bạn",
      time: "5 ngày trước",
      read: true,
      type: "review",
      content:
        "Cảm ơn bạn đã tham gia tour Nha Trang 3N2Đ!\n\nChúng tôi rất mong nhận được đánh giá từ bạn để cải thiện chất lượng dịch vụ. Đánh giá của bạn sẽ giúp những du khách khác có thêm thông tin tham khảo.\n\nVui lòng dành 2 phút để đánh giá tour nhé!",
      image: null,
    },
    {
      id: 7,
      title: "Cập nhật lịch trình tour Sa Pa",
      time: "6 ngày trước",
      read: true,
      type: "update",
      content:
        "Thông báo thay đổi lịch trình tour Sa Pa 2N1Đ:\n\nDo điều kiện thời tiết, chúng tôi điều chỉnh:\n- Ngày 1: Thăm bản Cát Cát (thay vì Lao Chải)\n- Ngày 2: Fansipan bằng cáp treo (thay vì trekking)\n\nMọi chi phí khác không đổi. Xin lỗi vì sự bất tiện!",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 8,
      title: "Chúc mừng sinh nhật! Ưu đãi đặc biệt dành cho bạn",
      time: "1 tuần trước",
      read: true,
      type: "birthday",
      content:
        "🎉 CHÚC MỪNG SINH NHẬT! 🎉\n\nNhân dịp sinh nhật của bạn, chúng tôi gửi tặng:\n\n🎁 Voucher giảm 15% cho tour tiếp theo\n🎁 Miễn phí bảo hiểm du lịch\n🎁 Upgrade phòng miễn phí (nếu có)\n\nMã voucher: BIRTHDAY2024\nHạn sử dụng: 30 ngày\n\nChúc bạn tuổi mới nhiều sức khỏe và hạnh phúc!",
      image: "/placeholder.svg?height=200&width=300",
    },
  ];
  
  export const fetchNotifications = (offset, limit) => {
    // Trong môi trường thực tế, đây sẽ là một lệnh gọi API đến backend
    // Ví dụ: return axios.get(`/api/notifications?offset=${offset}&limit=${limit}`);
    
    // Giả lập độ trễ mạng
    return new Promise((resolve) => {
      setTimeout(() => {
        const notificationsToReturn = mockNotifications.slice(offset, offset + limit);
        resolve(notificationsToReturn);
      }, 500); // Giả lập độ trễ 500ms
    });
  };
  
  export const markNotificationAsRead = (notificationId) => {
    // Trong môi trường thực tế, đây sẽ là một lệnh gọi API để cập nhật trạng thái trên backend
    // Ví dụ: return axios.post(`/api/notifications/${notificationId}/read`);
    
    console.log(`Notification ${notificationId} marked as read on backend.`);
    return Promise.resolve({ success: true });
  };