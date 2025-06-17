// client/src/pages/user/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Mail } from "lucide-react";
import { toast } from 'sonner';
// Sửa đổi import: Chỉ import async thunk `loginUser` và action `reset` để clear state
import { loginUser, reset } from '../../redux/slices/userSlice';

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const { email, password } = formData;

    // Sửa đổi 1: Lấy state từ `state.user` thay vì `state.auth`
    // và lấy `user`, `token` thay vì `isAuthenticated`, `role`
    const { user, token, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        // Xử lý khi có lỗi từ Redux
        if (error) {
            toast.error(error);
            dispatch(reset()); // Reset state lỗi sau khi hiển thị
        }

        // Sửa đổi 2: Suy ra `isAuthenticated` từ sự tồn tại của `token`.
        // Điều hướng sau khi đăng nhập thành công.
        const isAuthenticated = !!token;
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                toast.success('Đăng nhập với tư cách Admin thành công!');
                navigate('/admin/tong-quan'); // Điều hướng đến dashboard admin
            } else {
                toast.success('Đăng nhập thành công!');
                navigate('/'); // Điều hướng về trang chủ cho user
            }
        }
    }, [user, token, error, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Vui lòng nhập email và mật khẩu.");
            return;
        }
        // Sửa đổi 3: Dispatch async thunk `loginUser` với dữ liệu form
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="container mx-auto max-w-md py-12">
            <div className="rounded-lg border bg-white p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Đăng nhập</h1>
                    <p className="mt-2 text-gray-600">Đăng nhập vào tài khoản của bạn</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Các trường Input cho email và password */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="mail@example.com"
                            value={email}
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
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <Link to="/quen-mat-khau" className="text-sm text-blue-600 hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                </form>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập với (chỉ dành cho khách hàng)</span>
                    </div>
                </div>
                {/* Social Logins (Cần logic xử lý riêng) */}
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full"><Facebook className="mr-2 h-4 w-4 text-blue-600" /> Facebook</Button>
                    <Button variant="outline" className="w-full"><Mail className="mr-2 h-4 w-4 text-red-500" /> Google</Button>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Chưa có tài khoản? <Link to="/dang-ky" className="text-blue-600 hover:underline">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 
