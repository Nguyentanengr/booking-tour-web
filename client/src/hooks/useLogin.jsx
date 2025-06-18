import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner'; // Import toast
import { loginUser, reset } from '../redux/slices/userSlice';

export function useLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const { email, password } = formData;

    const { user, token, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        if (error) {
            toast.error(error); // Sử dụng toast để hiển thị lỗi
            dispatch(reset());
        }

        const isAuthenticated = !!token;
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                toast.success('Đăng nhập với tư cách Admin thành công!'); // Sử dụng toast cho thông báo thành công
                navigate('/admin/tong-quan');
            } else {
                toast.success('Đăng nhập thành công!'); // Sử dụng toast cho thông báo thành công
                navigate('/');
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
            toast.error("Vui lòng nhập email và mật khẩu."); // Sử dụng toast cho thông báo lỗi validation
            return;
        }
        dispatch(loginUser({ email, password }));
    };

    return {
        formData,
        loading,
        handleChange,
        handleSubmit,
    };
}