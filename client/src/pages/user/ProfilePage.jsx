import React from "react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile"; // Adjust path as needed
import ProfileForm from "@/components/profile/ProfileForm"; // Adjust path as needed
import { Toaster } from 'sonner'; // Make sure to include Toaster in your root layout or here

export default function ProfilePage() {
  const {
    userData,
    loading,
    savingProfile,
    handleProfileChange,
    handleGenderChange,
    handleBirthDateChange,
    handleAvatarUpload,
    handleSaveProfile,
  } = useProfile();

  if (loading) {
    return (
      <div className="container py-8 w-[1400px] mx-auto text-center">
        Đang tải thông tin cá nhân...
      </div>
    );
  }

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <Toaster position="top-right" richColors /> {/* Add Toaster component */}

      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>

      <ProfileForm
        userData={userData}
        handleProfileChange={handleProfileChange}
        handleGenderChange={handleGenderChange}
        handleBirthDateChange={handleBirthDateChange}
        handleAvatarUpload={handleAvatarUpload}
        handleSaveProfile={handleSaveProfile}
        savingProfile={savingProfile}
        loading={loading}
      />

    </div>
  );
}