import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Heart, MapPin, LogOut, ChevronDown } from "lucide-react";

export default function UserMenu({ handleLogout }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <img
            src="/placeholder.svg?height=32&width=32"
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="hidden md:inline">Nguyễn Văn A</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuItem asChild>
          <Link to="/tai-khoan" className="flex items-center gap-2">
            <User size={16} />
            <span>Thông tin cá nhân</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500">
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}