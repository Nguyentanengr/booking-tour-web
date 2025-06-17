import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import authService from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "male",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Hàm kiểm tra xem tất cả các trường đã được điền đầy đủ chưa
  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" 
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
        return;
    }
    setLoading(true);

    const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        gender: formData.gender,
    };

    try {
        const response = await authService.register(userData);
        toast.success(response.data.message || "Đăng ký thành công! Vui lòng đăng nhập.");
        setTimeout(() => {
            // Bây giờ hàm này sẽ hoạt động chính xác
            navigate('/dang-nhap');
        }, 2000);
    } catch (err) {
        // Block này của bạn đã chính xác
        const errorMessage = err.response?.data?.error?.[0]?.msg || err.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại.";
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
          <p className="text-gray-600 mt-2">Tạo tài khoản để trải nghiệm dịch vụ tốt nhất</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Giới tính</Label>
            <RadioGroup
              defaultValue="male"
              value={formData.gender}
              onValueChange={handleRadioChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Nữ</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0912345678"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={!isFormValid() || loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/dang-nhap" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}