import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import DestinationDropdown from "../header/DestinationDropdown";
import UserMenu from "../header/UserMenu";
import NotificationMenu from "../header/NotificationMenu";
import { useDispatch } from 'react-redux';


export default function Header() {
const dispatch = useDispatch()
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Giả lập trạng thái đăng nhập
  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("User logged out");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white pl-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
        
            <span className="text-xl font-bold text-blue-600">Du Lịch Việt</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <DestinationDropdown />

            <Link to="/lien-he" className="text-sm font-medium hover:text-blue-600">
              Liên hệ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <NotificationMenu />

              {/* User Menu */}
              <UserMenu handleLogout={handleLogout} />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/dang-nhap">
                <Button variant="ghost">Đăng nhập</Button>
              </Link>
              <Link href="/dang-ky">
                <Button>Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}