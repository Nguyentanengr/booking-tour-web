
import { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, User, Heart, MapPin, LogOut, Bell } from "lucide-react"

const regions = [
  {
    id: "mien-bac",
    name: "Miền Bắc",
    provinces: [
      { id: "ha-noi", name: "Hà Nội" },
      { id: "ha-long", name: "Hạ Long" },
      { id: "sa-pa", name: "Sa Pa" },
      { id: "ninh-binh", name: "Ninh Bình" },
      { id: "ha-giang", name: "Hà Giang" },
      { id: "cao-bang", name: "Cao Bằng" },
    ],
  },
  {
    id: "mien-trung",
    name: "Miền Trung",
    provinces: [
      { id: "da-nang", name: "Đà Nẵng" },
      { id: "hue", name: "Huế" },
      { id: "hoi-an", name: "Hội An" },
      { id: "nha-trang", name: "Nha Trang" },
      { id: "quy-nhon", name: "Quy Nhơn" },
      { id: "phu-yen", name: "Phú Yên" },
    ],
  },
  {
    id: "mien-nam",
    name: "Miền Nam",
    provinces: [
      { id: "ho-chi-minh", name: "TP. Hồ Chí Minh" },
      { id: "vung-tau", name: "Vũng Tàu" },
      { id: "phu-quoc", name: "Phú Quốc" },
      { id: "can-tho", name: "Cần Thơ" },
      { id: "dong-nai", name: "Đồng Nai" },
      { id: "tay-ninh", name: "Tây Ninh" },
    ],
  },
]

export default function UserHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="w-[1400px] mx-auto container flex h-16 items-center justify-between">
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-blue-600">Du Lịch Việt</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 w-25">
                  Điểm đến <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[500px] p-4">
                <div className="grid grid-cols-3 gap-6">
                  {regions.map((region) => (
                    <div key={region.id}>
                      <DropdownMenuLabel className="text-blue-600 font-semibold">{region.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="space-y-1">
                        {region.provinces.map((province) => (
                          <DropdownMenuItem key={province.id} asChild>
                            <Link
                              to={`/tours?destination=${province.id}`}
                              className="block px-2 py-1 text-sm hover:bg-gray-100 rounded"
                            >
                              {province.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/lien-he" className="text-sm font-medium hover:text-blue-600">
              Liên hệ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-8">
          {isLoggedIn ? (
            <>
              {/* Favorite Tours */}
              <Link to="/favorite-tours">
                <Button variant="ghost" size="icon" className="relative ">
                  <Heart size={18} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                    3
                  </Badge>
                </Button>
              </Link>

              {/* My Tours */}
              <Link to="/my-tours">
                <Button variant="ghost" size="icon" className="relative">
                  <MapPin size={18} />
                </Button>
              </Link>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={18} />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Tour Phú Quốc đã được xác nhận</p>
                      <p className="text-xs text-gray-500">2 giờ trước</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Khuyến mãi mùa hè 2024</p>
                      <p className="text-xs text-gray-500">1 ngày trước</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="text-blue-600">
                      Xem tất cả thông báo
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">Nguyễn Văn A</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
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
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/dang-nhap">
                <Button variant="ghost" className= "w-25">Đăng nhập</Button>
              </Link>
              <Link to="/dang-ky">
                <Button className="bg-blue-600 hover:bg-blue-800 w-25">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
