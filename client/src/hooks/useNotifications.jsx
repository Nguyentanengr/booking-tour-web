import { useState, useEffect } from "react";
import * as notificationService from "@/utils/fakeNotification.js"; // Đảm bảo đường dẫn đúng đến file notificationService.js

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null); // Thêm state để xử lý lỗi

  useEffect(() => {
    const loadInitialNotifications = async () => { // Đổi thành hàm async
      try {
        const initialNotifications = await notificationService.fetchNotifications(0, 3); // Await kết quả
        setNotifications(initialNotifications);
        setHasMore(initialNotifications.length === 3);
      } catch (err) {
        setError("Không thể tải thông báo ban đầu."); // Xử lý lỗi khi tải
        console.error("Lỗi khi tải thông báo ban đầu:", err);
      }
    };

    loadInitialNotifications(); // Gọi hàm async
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadMoreNotifications = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const currentLength = notifications.length;
      const newNotifications = await notificationService.fetchNotifications( // Await kết quả
        currentLength,
        2
      );

      if (newNotifications.length === 0) {
        setHasMore(false);
      } else {
        setNotifications((prev) => [...prev, ...newNotifications]);
      }
    } catch (err) {
      setError("Không thể tải thêm thông báo."); // Xử lý lỗi khi tải thêm
      console.error("Lỗi khi tải thêm thông báo:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // Trong thực tế, bạn sẽ gọi một API để đánh dấu đã đọc trên server
    // Ví dụ:
    // notificationService.markNotificationAsRead(id).catch(err => {
    //   console.error("Lỗi khi đánh dấu thông báo đã đọc:", err);
    //   // Có thể rollback state nếu API báo lỗi
    // });
  };

  return {
    notifications,
    unreadCount,
    isLoadingMore,
    hasMore,
    loadMoreNotifications,
    markNotificationAsRead,
    error, // Trả về lỗi để có thể hiển thị cho người dùng
  };
}