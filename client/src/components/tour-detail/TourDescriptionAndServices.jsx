// components/TourDescriptionAndServices.jsx
import React from "react";

export default function TourDescriptionAndServices({ description, services }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Mô tả tour</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Dịch vụ bao gồm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {services.map((service, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">{service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}