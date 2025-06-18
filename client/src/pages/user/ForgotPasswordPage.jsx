import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useForgotPassword } from "@/hooks/useForgotPassword"; // Adjust path as needed
import ForgotPasswordForm from "@/components/forgot-password/ForgotPasswordForm"; // Adjust path as needed

export default function ForgotPasswordPage() {
    const {
        email,
        setEmail,
        step,
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
        goBack,
    } = useForgotPassword();

    // Re-use handleEmailSubmit for the "Gửi lại mã" button
    const handleResendOtp = handleEmailSubmit;

    return (
        <div className="container mx-auto max-w-md py-12">
            <div className="rounded-lg border bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goBack}
                        className="mr-2"
                        disabled={loading}
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {step === 1 && "Quên mật khẩu"}
                        {step === 2 && "Xác nhận OTP"}
                        {step === 3 && "Đặt lại mật khẩu"}
                    </h1>
                </div>

                <ForgotPasswordForm
                    step={step}
                    email={email}
                    setEmail={setEmail}
                    otp={otp}
                    handleOtpChange={handleOtpChange}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    loading={loading}
                    handleEmailSubmit={handleEmailSubmit}
                    handleOtpSubmit={handleOtpSubmit}
                    handleResetPassword={handleResetPassword}
                    handleResendOtp={handleResendOtp}
                />

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