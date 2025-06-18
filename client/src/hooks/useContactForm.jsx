import { useState } from "react";
import { submitContactForm } from "@/utils/fakeContact.js"; // Adjust path as needed

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      subject: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await submitContactForm(formData); // Gọi API
      setSuccess(true);
      alert(result.message); // Hiển thị thông báo thành công
      // Reset form sau khi gửi thành công
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err);
      alert(err.message || "Có lỗi xảy ra, vui lòng thử lại."); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSelectChange,
    handleSubmit,
    loading,
    error,
    success,
  };
};