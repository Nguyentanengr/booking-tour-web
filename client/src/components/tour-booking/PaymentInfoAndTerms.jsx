import { Checkbox } from "@/components/ui/checkbox";


export function PaymentInfoAndTerms({ agreeTerms, setAgreeTerms, subscribeNewsletter, setSubscribeNewsletter }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Thanh toán trực tuyến an toàn</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Thanh toán được bảo mật bằng công nghệ SSL 256-bit</li>
            <li>• Hỗ trợ các loại thẻ: Visa, Mastercard, JCB</li>
            <li>• Không lưu trữ thông tin thẻ của khách hàng</li>
            <li>• Hoàn tiền 100% nếu giao dịch không thành công</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm leading-relaxed">
              Tôi đồng ý với{" "}
              {/* Using <a> tag instead of Next.js Link */}
              <a href="/terms" className="text-blue-600 hover:underline">
                điều khoản và điều kiện
              </a>{" "}
              và{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                chính sách bảo mật
              </a>{" "}
              của Du Lịch Việt
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="newsletter"
              checked={subscribeNewsletter}
              onCheckedChange={(checked) => setSubscribeNewsletter(checked)}
              className="mt-1"
            />
            <label htmlFor="newsletter" className="text-sm">
              Đăng ký nhận thông tin khuyến mãi và tour mới qua email
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}