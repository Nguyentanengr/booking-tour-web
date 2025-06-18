import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { provinceService } from "@/services/provinceService"; // Import provinceService

export default function UserFooter() {
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setIsLoading(true);
        const data = await provinceService.getProvincesByRegion();
        setRegions(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu vùng miền cho footer:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (isLoading) {
    return (
      <footer className="bg-white border-t ">
        <div className="container py-8 md:py-12 w-[1400px] mx-auto">
          <div className="text-center text-gray-500">Đang tải thông tin vùng miền...</div>
        </div>
      </footer>
    );
  }

  if (error) {
    console.error("Không thể tải dữ liệu vùng miền cho footer từ API.");
    // Bạn có thể thêm logic hiển thị lỗi cho người dùng ở đây,
    // hoặc sử dụng dữ liệu fake tĩnh nếu API thất bại.
    // Ví dụ: return <div>Có lỗi xảy ra khi tải dữ liệu footer.</div>;
  }

  // Sử dụng dữ liệu từ state `regions` (đã được fetch từ API)
  // Nếu có lỗi và bạn muốn footer hiển thị trống phần miền, regions sẽ là mảng rỗng ban đầu.
  const regionsToRender = regions;


  return (
    <footer className="bg-white border-t ">
      <div className="container py-8 md:py-12 w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Logo và mô tả */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-blue-600">Du Lịch Việt</span>
            </Link>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Khám phá vẻ đẹp Việt Nam qua các tour du lịch chất lượng, an toàn và đáng nhớ.
            </p>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Giấy phép kinh doanh lữ hành</p>
              <p>Số: 79-2019/TCDL-GP LHQT</p>
            </div>
          </div>

          {/* Các miền */}
          {regionsToRender.map((region) => (
            <div key={region.name}>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">{region.name}</h3>
              <ul className="space-y-1.5">
                {region.provinces.map((province) => (
                  <li key={province.id || province.name || province}> {/* Sử dụng province.id hoặc province.name làm key nếu nó là object, hoặc chính nó nếu là string */}
                    <Link
                      to={`/danh-sach-tour`}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {typeof province === 'object' && province !== null ? province.name : province} {/* Hiển thị province.name nếu là object, ngược lại hiển thị province */}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    to={`/danh-sach-tour`}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Xem tất cả →
                  </Link>
                </li>
              </ul>
            </div>
          ))}

          {/* Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  123 Nguyễn Huệ, Quận 1,
                  <br />
                  TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p>
                    Hotline: <span className="font-medium">1900 1234</span>
                  </p>
                  <p>
                    Tel: <span className="font-medium">(028) 3822 9999</span>
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">info@dulichviet.com</span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 font-medium">Hỗ trợ 24/7</p>
              <p className="text-xs text-blue-600">Luôn sẵn sàng phục vụ bạn</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Du Lịch Việt. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Thiết kế bởi Du Lịch Việt</span>
              <span>•</span>
              <span>Phiên bản 2.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}