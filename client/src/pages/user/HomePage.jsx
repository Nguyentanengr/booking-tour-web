// src/pages/HomePage.jsx
import React from "react";
import HeroSection from "@/components/home/HeroSection";
import TourSearchForm from "@/components/home/TourSearchForm";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import PopularTours from "@/components/home/PopularTours";
import { useHomeData } from "@/hooks/useHomeData"; // Import custom hook

export default function HomePage() {
  const { regions, popularTours, loading, error } = useHomeData(); // Sử dụng hook

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-xl">Đang tải dữ liệu...</p>
        {/* Bạn có thể thêm spinner hoặc skeleton loader ở đây */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-red-600">
        <p className="text-xl">Đã xảy ra lỗi: {error}</p>
        <p>Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TourSearchForm />
      {/* Chỉ render các phần này khi dữ liệu đã tải xong */}
      {regions.length > 0 && <FeaturedDestinations regions={regions} />}
      {popularTours.length > 0 && <PopularTours popularTours={popularTours} />}
    </div>
  );
}