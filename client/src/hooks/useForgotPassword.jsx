import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import authService from '../services/authService'; // Adjust path if necessary

export const useForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

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
        if (value.length > 1 || !/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

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
            setTimeout(() => navigate("/dang-nhap"), 2000); // Navigate to login after 2 seconds
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Đã có lỗi xảy ra.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate("/dang-nhap");
        }
    };

    return {
        email,
        setEmail,
        step,
        setStep, // Expose setStep if there's a need to jump steps, otherwise keep internal
        otp,
        setOtp,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        handleEmailSubmit,
        handleOtpChange,
        handleOtpSubmit,
        handleResetPassword,
        goBack,
    };
};