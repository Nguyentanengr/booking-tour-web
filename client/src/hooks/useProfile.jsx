import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { fetchUserProfile, updateProfile } from "@/utils/fakeProfileUser.js"; // Adjust path as needed

export const useProfile = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    avatarUrl: "",
    birthDate: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);


  // Fetch user data on component mount
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetchUserProfile();
        setUserData({
          ...response.data,
          // Ensure birthDate is a Date object if it comes as string from API
          birthDate: response.data.birthDate ? new Date(response.data.birthDate) : new Date(),
        });
        toast.success(response.message);
      } catch (err) {
        toast.error(err.message || "Không thể tải thông tin cá nhân.");
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleGenderChange = (value) => {
    setUserData({
      ...userData,
      gender: value,
    });
  };

  const handleBirthDateChange = (date) => {
    setUserData({
      ...userData,
      birthDate: date,
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({
          ...userData,
          avatarUrl: e.target?.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await updateProfile(userData);
      toast.success(response.message);
    } catch (err) {
      toast.error(err.message || "Cập nhật thông tin thất bại.");
    } finally {
      setSavingProfile(false);
    }
  };


  return {
    userData,
    loading,
    savingProfile,
    setUserData,
    handleProfileChange,
    handleGenderChange,
    handleBirthDateChange,
    handleAvatarUpload,
    handleSaveProfile,

  };
};