import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from 'sonner';
// Đảm bảo authService đã được import
import authService from '../../services/authService';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Thêm state để quản lý trạng thái loading
    const [loading, setLoading] = useState(false);

    // Sửa đổi 1: Tích hợp API gửi yêu cầu OTP
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.forgotPassword(email);
            toast.success(response.data.message || "Mã OTP đã được gửi thành công!");
            setStep(2);
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Đã có lỗi xảy ra.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1 || !/^[0-9]*$/.test(value)) return; // Chỉ cho phép số và 1 ký tự

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };
    
    // Sửa đổi 2: Tích hợp API xác thực OTP
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            toast.error("Mã OTP phải đủ 6 ký tự.");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.verifyOtp(email, finalOtp);
            toast.success(response.data.message || "Xác thực OTP thành công!");
            setStep(3);
        } catch (err) {
            const errorMessage = err.response?.data?.error || "OTP không hợp lệ.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Sửa đổi 3: Tích hợp API đặt lại mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.resetPassword(email, otp.join(""), newPassword);
            toast.success(response.data.message || "Đặt lại mật khẩu thành công!");
            // Đợi 2s rồi chuyển về trang đăng nhập
            setTimeout(() => navigate("/dang-nhap"), 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Đã có lỗi xảy ra.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md py-12">
            <div className="rounded-lg border bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => (step > 1 ? setStep(step - 1) : navigate("/dang-nhap"))}
                        className="mr-2"
                        disabled={loading} // Vô hiệu hóa khi đang tải
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {step === 1 && "Quên mật khẩu"}
                        {step === 2 && "Xác nhận OTP"}
                        {step === 3 && "Đặt lại mật khẩu"}
                    </h1>
                </div>

                {/* Step 1: Form nhập Email */}
                {step === 1 && (
                    <>
                        <p className="mb-6 text-gray-600">
                            Vui lòng nhập địa chỉ email của bạn. Chúng tôi sẽ gửi mã OTP để xác nhận tài khoản.
                        </p>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email" type="email" placeholder="example@gmail.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    required disabled={loading}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                            </Button>
                        </form>
                    </>
                )}

                {/* Step 2: Form nhập OTP */}
                {step === 2 && (
                    <>
                        <p className="mb-6 text-gray-600">
                            Chúng tôi đã gửi mã OTP đến email {email}. Vui lòng kiểm tra và nhập mã xác nhận.
                        </p>
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp-0">Mã xác nhận</Label>
                                <div className="flex justify-between gap-2">
                                    {otp.map((digit, index) => (
                                        <Input
                                            key={index} id={`otp-${index}`} type="text"
                                            inputMode="numeric" maxLength={1}
                                            className="h-12 w-12 text-center text-lg"
                                            value={digit} onChange={(e) => handleOtpChange(index, e.target.value)}
                                            required disabled={loading}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="text-center">
                                <Button type="button" variant="link" className="text-blue-600" onClick={handleEmailSubmit} disabled={loading}>
                                    Gửi lại mã
                                </Button>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Đang xác thực...' : 'Xác nhận'}
                            </Button>
                        </form>
                    </>
                )}

                {/* Step 3: Form đặt lại mật khẩu */}
                {step === 3 && (
                    <>
                        <p className="mb-6 text-gray-600">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                <Input
                                    id="new-password" type="password" placeholder="••••••••"
                                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    required disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                                <Input
                                    id="confirm-password" type="password" placeholder="••••••••"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    required disabled={loading}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Đặt lại mật khẩu'}
                            </Button>
                        </form>
                    </>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Quay lại{" "}
                        <Link to="/dang-nhap" className="text-blue-600 hover:underline">
                            đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
