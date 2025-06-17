
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Phone, Star } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const myTours = {
  upcoming: [
    {
      id: 1,
      name: "Hà Nội - Hạ Long - Ninh Bình",
      tourCode: "HN567",
      departureDate: new Date(2024, 5, 10),
      returnDate: new Date(2024, 5, 15),
      duration: "5N4Đ",
      transportation: "Máy bay",
      price: 8990000,
      status: "confirmed",
      image: "https://photo.znews.vn/w1920/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
      passengers: 2,
    },
    {
      id: 1,
      name: "Hà Nội - Hạ Long - Ninh Bình",
      tourCode: "HN567",
      departureDate: new Date(2024, 5, 10),
      returnDate: new Date(2024, 5, 15),
      duration: "5N4Đ",
      transportation: "Máy bay",
      price: 8990000,
      status: "confirmed",
      image: "https://photo.znews.vn/w1920/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
      passengers: 2,
    },
  ],
  completed: [
    {
      id: 2,
      name: "Phú Quốc - Thiên đường biển đảo",
      tourCode: "PQ234",
      departureDate: new Date(2024, 2, 15),
      returnDate: new Date(2024, 2, 19),
      duration: "4N3Đ",
      transportation: "Máy bay",
      price: 6590000,
      status: "completed",
      image: "https://photo.znews.vn/w1920/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
      passengers: 2,
      rating: 5,
    },
  ],
  cancelled: [
    {
      id: 3,
      name: "Đà Nẵng - Hội An - Huế",
      tourCode: "DN789",
      departureDate: new Date(2024, 3, 20),
      returnDate: new Date(2024, 3, 24),
      duration: "4N3Đ",
      transportation: "Máy bay",
      price: 5790000,
      status: "cancelled",
      image: "https://photo.znews.vn/w1920/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
      passengers: 2,
      cancelDate: new Date(2024, 3, 15),
      refundAmount: 4632000,
    },
  ],
}

const getStatusBadge = (status) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-500">Đã xác nhận</Badge>
    case "completed":
      return <Badge className="bg-blue-500">Đã hoàn thành</Badge>
    case "cancelled":
      return <Badge variant="destructive">Đã hủy</Badge>
    default:
      return <Badge variant="secondary">Chờ xác nhận</Badge>
  }
}

export default function MyToursPage() {
  const totalTours = myTours.upcoming.length + myTours.completed.length + myTours.cancelled.length

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">My Tour</h1>
        <Badge variant="secondary">{totalTours} tour</Badge>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar size={16} />
            Sắp tới ({myTours.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <MapPin size={16} />
            Đã hoàn thành ({myTours.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <Phone size={16} />
            Đã hủy ({myTours.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {myTours.upcoming.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Không có tour sắp tới</h2>
              <p className="text-gray-500 mb-6">Hãy đặt tour mới để bắt đầu chuyến phiêu lưu</p>
              <Link to="/tours">
                <Button>Đặt tour ngay</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {myTours.upcoming.map((tour) => (
                <div key={tour.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="relative h-[200px] md:h-full">
                      <img src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                    </div>
                    <div className="col-span-3 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{tour.name}</h3>
                            {getStatusBadge(tour.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Mã tour:</span>
                              <span>{tour.tourCode}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Thời gian:</span>
                              <span>{tour.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Ngày đi:</span>
                              <span>{format(tour.departureDate, "dd/MM/yyyy", { locale: vi })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Ngày về:</span>
                              <span>{format(tour.returnDate, "dd/MM/yyyy", { locale: vi })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Số người:</span>
                              <span>{tour.passengers} người</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Phương tiện:</span>
                              <span>{tour.transportation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="lg:border-l lg:pl-4 flex flex-col justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Giá tour:</p>
                            <p className="text-xl font-bold text-red-600">{tour.price.toLocaleString()} đ</p>
                          </div>
                          <div className="flex flex-col gap-2 mt-4">
                            <Button variant="destructive" size="sm">
                              Hủy đặt tour
                            </Button>
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {myTours.completed.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa có tour đã hoàn thành</h2>
              <p className="text-gray-500">Các tour đã hoàn thành sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myTours.completed.map((tour) => (
                <div key={tour.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="relative h-[200px] md:h-full">
                      <img src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                    </div>
                    <div className="col-span-3 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{tour.name}</h3>
                            {getStatusBadge(tour.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Mã tour:</span>
                              <span>{tour.tourCode}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Thời gian:</span>
                              <span>{tour.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Ngày đi:</span>
                              <span>{format(tour.departureDate, "dd/MM/yyyy", { locale: vi })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Ngày về:</span>
                              <span>{format(tour.returnDate, "dd/MM/yyyy", { locale: vi })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Số người:</span>
                              <span>{tour.passengers} người</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Phương tiện:</span>
                              <span>{tour.transportation}</span>
                            </div>
                          </div>
                          {tour.rating && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Đánh giá của bạn:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < tour.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="lg:border-l lg:pl-4 flex flex-col justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Giá tour:</p>
                            <p className="text-xl font-bold text-red-600">{tour.price.toLocaleString()} đ</p>
                          </div>
                          <div className="flex flex-col gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              Đánh giá
                            </Button>
                            <Button size="sm" className = "bg-blue-600 hover:bg-blue-800">Đặt lại</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {myTours.cancelled.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Không có tour đã hủy</h2>
              <p className="text-gray-500">Các tour đã hủy sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myTours.cancelled.map((tour) => (
                <div key={tour.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="relative h-[200px] md:h-full">
                      <img src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                    </div>
                    <div className="col-span-3 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{tour.name}</h3>
                            {getStatusBadge(tour.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Mã tour:</span>
                              <span>{tour.tourCode}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Thời gian:</span>
                              <span>{tour.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Ngày hủy:</span>
                              <span>{format(tour.cancelDate, "dd/MM/yyyy", { locale: vi })}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Lý do:</span>
                              <span>Thay đổi lịch trình</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Số người:</span>
                              <span>{tour.passengers} người</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="font-medium">Phương tiện:</span>
                              <span>{tour.transportation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="lg:border-l lg:pl-4 flex flex-col justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Giá tour:</p>
                            <p className="text-xl font-bold text-red-600">{tour.price.toLocaleString()} đ</p>
                            <p className="text-sm text-gray-600 mt-2">Hoàn tiền:</p>
                            <p className="text-lg font-bold text-green-600">
                              {tour.refundAmount.toLocaleString()} đ (80%)
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 mt-4">
                            <Button size="sm" className = "bg-blue-600 hover:bg-blue-800">Đặt lại</Button>
                            <Button variant="outline" size="sm">
                              Chi tiết hoàn tiền
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
