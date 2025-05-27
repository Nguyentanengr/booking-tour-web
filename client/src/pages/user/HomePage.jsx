
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const regions = [
  {
    id: "mien-bac",
    name: "Miền Bắc",
    provinces: [
      {
        id: "ha-noi",
        name: "Hà Nội",
        image: "/placeholder.svg?height=300&width=400",
        description: "Thủ đô ngàn năm văn hiến với nhiều di tích lịch sử, văn hóa và ẩm thực đặc sắc.",
      },
      {
        id: "ha-long",
        name: "Hạ Long",
        image: "/placeholder.svg?height=300&width=400",
        description: "Vịnh biển với hàng nghìn hòn đảo đá vôi tạo nên cảnh quan thiên nhiên kỳ vĩ.",
      },
      {
        id: "sa-pa",
        name: "Sa Pa",
        image: "/placeholder.svg?height=300&width=400",
        description:
          "Thị trấn trong mây với ruộng bậc thang, văn hóa dân tộc đa dạng và khung cảnh thiên nhiên tuyệt đẹp.",
      },
      {
        id: "sa-pa",
        name: "Sa Pa",
        image: "/placeholder.svg?height=300&width=400",
        description:
          "Thị trấn trong mây với ruộng bậc thang, văn hóa dân tộc đa dạng và khung cảnh thiên nhiên tuyệt đẹp.",
      },
    ],
  },
  {
    id: "mien-trung",
    name: "Miền Trung",
    provinces: [
      {
        id: "da-nang",
        name: "Đà Nẵng",
        image: "/placeholder.svg?height=300&width=400",
        description: "Thành phố biển xinh đẹp với cầu Rồng, bán đảo Sơn Trà và bãi biển Mỹ Khê nổi tiếng.",
      },
      {
        id: "hue",
        name: "Huế",
        image: "/placeholder.svg?height=300&width=400",
        description: "Cố đô với hệ thống di tích lịch sử, văn hóa phong phú và ẩm thực cung đình độc đáo.",
      },
      {
        id: "hoi-an",
        name: "Hội An",
        image: "/placeholder.svg?height=300&width=400",
        description: "Phố cổ yên bình với kiến trúc độc đáo, đèn lồng rực rỡ và không khí truyền thống đặc sắc.",
      },
    ],
  },
  {
    id: "mien-nam",
    name: "Miền Nam",
    provinces: [
      {
        id: "ho-chi-minh",
        name: "TP. Hồ Chí Minh",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zPI0b7t4Sc9RyBrMbDTF2yPU8ZkVSO.png",
        description: "Thành phố năng động nhất Việt Nam với nhiều điểm tham quan lịch sử, văn hóa và ẩm thực đa dạng.",
      },
      {
        id: "vung-tau",
        name: "Bà Rịa - Vũng Tàu",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zPI0b7t4Sc9RyBrMbDTF2yPU8ZkVSO.png",
        description: "Thành phố biển với bãi cát trắng mịn, nước biển trong xanh và nhiều điểm tham quan hấp dẫn.",
      },
      {
        id: "phu-quoc",
        name: "Phú Quốc",
        image: "/placeholder.svg?height=300&width=400",
        description: "Đảo ngọc với bãi biển tuyệt đẹp, rừng nguyên sinh và ẩm thực hải sản phong phú.",
      },
    ],
  },
]

const popularTours = [
  {
    id: 1,
    name: "Đà Lạt - Thành phố ngàn hoa",
    tourCode: "DL001",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Đà Lạt",
    duration: "3N2Đ",
    transportation: "Xe khách",
    price: 2590000,
    discountedPrice: null,
    image: "/placeholder.svg?height=200&width=400",
    isBestseller: true,
    departureDates: ["28/05", "03/06", "04/06", "10/06"],
  },
  {
    id: 2,
    name: "Phú Quốc - Thiên đường biển đảo",
    tourCode: "PQ002",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Phú Quốc",
    duration: "4N3Đ",
    transportation: "Máy bay",
    price: 6590000,
    discountedPrice: 5590000,
    image: "/placeholder.svg?height=200&width=400",
    isBestseller: false,
    departureDates: ["01/06", "08/06", "15/06", "22/06"],
  },
  {
    id: 3,
    name: "Hạ Long - Kỳ quan thiên nhiên thế giới",
    tourCode: "HL003",
    startingProvince: "Hà Nội",
    destinationProvince: "Hạ Long",
    duration: "2N1Đ",
    transportation: "Xe khách",
    price: 1890000,
    discountedPrice: null,
    image: "/placeholder.svg?height=200&width=400",
    isBestseller: true,
    departureDates: ["30/05", "06/06", "13/06", "20/06"],
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px]">
        <img
          src="client\src\assets\img\du-lich-viet.jpg"
          alt="Du lịch Việt Nam"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Khám Phá Việt Nam</h1>
          <p className="text-lg md:text-xl max-w-3xl mb-8">
            Trải nghiệm vẻ đẹp thiên nhiên, văn hóa và ẩm thực đặc sắc tại mọi miền đất nước
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="container -mt-16 relative z-20 mb-12 w-[1400px] mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tìm kiếm tour du lịch</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input placeholder="Tên tour hoặc mã tour" className="pl-9" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Điểm khởi hành</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn điểm khởi hành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                  <SelectItem value="hanoi">Hà Nội</SelectItem>
                  <SelectItem value="danang">Đà Nẵng</SelectItem>
                  <SelectItem value="cantho">Cần Thơ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Điểm đến</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn điểm đến" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vungtau">Vũng Tàu</SelectItem>
                  <SelectItem value="dalat">Đà Lạt</SelectItem>
                  <SelectItem value="phuquoc">Phú Quốc</SelectItem>
                  <SelectItem value="nhatrang">Nha Trang</SelectItem>
                  <SelectItem value="sapa">Sa Pa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Thời gian</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1n">1 ngày</SelectItem>
                  <SelectItem value="2n1d">2N1Đ</SelectItem>
                  <SelectItem value="3n2d">3N2Đ</SelectItem>
                  <SelectItem value="4n3d">4N3Đ</SelectItem>
                  <SelectItem value="5n4d">5N4Đ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="container py-12 w-[1400px] mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Địa điểm nổi bật</h2>
        <Tabs defaultValue="mien-nam" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {regions.map((region) => (
              <TabsTrigger key={region.id} value={region.id}>
                {region.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {regions.map((region) => (
            <TabsContent key={region.id} value={region.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {region.provinces.map((province) => (
                  <div key={province.id} className="group relative h-[300px] rounded-lg overflow-hidden">
                    <img
                      src={province.image || "/placeholder.svg"}
                      alt={province.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{province.name}</h3>
                      <div className="h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:h-auto group-hover:opacity-100 mb-4">
                        <p className="text-white text-sm">{province.description}</p>
                      </div>
                      <Link to={`/tours?destination=${province.id}`}>
                        <Button
                          variant="outline"
                          className="w-fit bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black transition-colors opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        >
                          Khám phá
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Popular Tours Section */}
      <section className="bg-gray-50 py-12 w-[1400px] mx-auto">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Tour phổ biến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-[200px]">
                  <img src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {tour.discountedPrice && (
                      <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">Tiết kiệm</div>
                    )}
                    {tour.isBestseller && (
                      <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">Bestseller</div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{tour.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Mã tour:</span> {tour.tourCode}
                    </div>
                    <div>
                      <span className="font-medium">Khởi hành:</span> {tour.startingProvince}
                    </div>
                    <div>
                      <span className="font-medium">Thời gian:</span> {tour.duration}
                    </div>
                    <div>
                      <span className="font-medium">Phương tiện:</span> {tour.transportation}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Ngày khởi hành:</p>
                    <div className="flex flex-wrap gap-1">
                      {tour.departureDates.map((date, index) => (
                        <span key={index} className="text-xs border border-red-500 text-red-500 rounded px-2 py-1">
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Giá từ</p>
                      <div className="flex items-center gap-2">
                        {tour.discountedPrice ? (
                          <>
                            <p className="text-lg font-bold text-red-600">{tour.discountedPrice.toLocaleString()} đ</p>
                            <p className="text-sm text-gray-500 line-through">{tour.price.toLocaleString()} đ</p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-red-600">{tour.price.toLocaleString()} đ</p>
                        )}
                      </div>
                    </div>
                    <Link to={`/tours/${tour.id}`}>
                      <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link to="/tours">
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                Xem tất cả tour
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
