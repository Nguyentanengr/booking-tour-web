import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordForm = ({
    step,
    email,
    setEmail,
    otp,
    handleOtpChange,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleEmailSubmit,
    handleOtpSubmit,
    handleResetPassword,
    handleResendOtp // Pass this from the hook for "Gửi lại mã"
}) => {
    return (
        <>
            {/* Step 1: Email Input Form */}
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

            {/* Step 2: OTP Input Form */}
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
                            <Button type="button" variant="link" className="text-blue-600" onClick={handleResendOtp} disabled={loading}>
                                Gửi lại mã
                            </Button>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                            {loading ? 'Đang xác thực...' : 'Xác nhận'}
                        </Button>
                    </form>
                </>
            )}

            {/* Step 3: Reset Password Form */}
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
        </>
    );
};

export default ForgotPasswordForm;