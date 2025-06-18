// src/components/ui/HeroSection.jsx
import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[600px]">
      
      <div className="absolute inset-0 bg-black/20" />
      <div className="container mx-auto relative z-0 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Khám Phá Việt Nam</h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8">
          Trải nghiệm vẻ đẹp thiên nhiên, văn hóa và ẩm thực đặc sắc tại mọi miền đất nước
        </p>
      </div>
    </section>
  );
}