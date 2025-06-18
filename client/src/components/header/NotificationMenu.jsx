import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MapPin } from "lucide-react";
import {Link} from "react-router-dom";
import useNotifications from "@/hooks/useNotifications"; // Import custom hook

export default function NotificationMenu() {
  const {
    notifications,
    unreadCount,
    isLoadingMore,
    hasMore,
    markNotificationAsRead,
    loadMoreNotifications,
  } = useNotifications();

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationDialogOpen(true);
    markNotificationAsRead(notification.id);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return "✅";
      case "promotion":
        return "🎉";
      case "payment":
        return "💳";
      case "reminder":
        return "⏰";
      case "review":
        return "⭐";
      case "update":
        return "📝";
      case "birthday":
        return "🎂";
      default:
        return "📢";
    }
  };

  return (
    <>
        <Link to='tour-yeu-thich'>
                <Button variant="ghost" size="icon" className="relative">
                        <Heart size={18} />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                        3
                </Badge>
        </Button>
        </Link>
      
        <Link to="/tour-cua-toi">
                <Button variant="ghost" size="icon" className="relative">
                        <MapPin size={18} />
                </Button>
        </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={18} />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] p-0" sideOffset={8}>
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-lg">Thông báo</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-blue-600 font-medium">{unreadCount} thông báo mới</p>
            )}
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-relaxed ${!notification.read ? "font-semibold text-gray-900" : "text-gray-700"}`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">{notification.time}</p>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                  </div>
                </div>
              </div>
            ))}

            {/* Load more trigger */}
            {hasMore && (
              <div className="p-4 text-center">
                <Button
                  variant="ghost"
                  onClick={loadMoreNotifications}
                  disabled={isLoadingMore}
                  className="w-full"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                      Đang tải...
                    </div>
                  ) : (
                    "Xem thêm thông báo"
                  )}
                </Button>
              </div>
            )}

            {!hasMore && notifications.length > 0 && (
              <div className="p-4 text-center text-sm text-gray-500 bg-gray-50">
                Đã hiển thị tất cả thông báo
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification Detail Dialog */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{getNotificationIcon(selectedNotification.type)}</div>
                  <div className="flex-1">
                    <DialogTitle className="text-lg font-semibold text-left">{selectedNotification.title}</DialogTitle>
                    <p className="text-sm text-blue-600 font-medium mt-1">{selectedNotification.time}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {selectedNotification.image && (
                  <div className="w-full">
                    <img
                      src={selectedNotification.image || "/placeholder.svg"}
                      alt="Notification image"
                      width={600}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {selectedNotification.content}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => setIsNotificationDialogOpen(false)}>Đóng</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}