// client/src/pages/user/LoginPage.jsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Mail } from "lucide-react";
import { useLogin } from '../../hooks/useLogin'; // Import the custom hook

export default function LoginPage() {
    const { formData, loading, handleChange, handleSubmit } = useLogin();
    const { email, password } = formData;

    return (
        <div className="container mx-auto max-w-md py-12">
            <div className="rounded-lg border bg-white p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Đăng nhập</h1>
                    <p className="mt-2 text-gray-600">Đăng nhập vào tài khoản của bạn</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
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