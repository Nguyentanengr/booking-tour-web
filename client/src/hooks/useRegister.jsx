// client/src/hooks/useRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner'; // Import toast
import authService from "../services/authService"; // Assuming authService is correctly set up

export function useRegister() {
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
            toast.error("Mật khẩu và xác nhận mật khẩu không khớp!"); // Sử dụng toast cho thông báo lỗi validation
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
            toast.success(response.data.message || "Đăng ký thành công! Vui lòng đăng nhập."); // Sử dụng toast cho thông báo thành công
            setTimeout(() => {
                navigate('/dang-nhap');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.error?.[0]?.msg || err.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại.";
            toast.error(errorMessage); // Sử dụng toast cho thông báo lỗi từ API
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        isFormValid,
        handleChange,
        handleRadioChange,
        handleSubmit,
    };
}