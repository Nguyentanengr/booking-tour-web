// src/components/AdditionalServicesSummary.jsx
import React from "react";

export function AdditionalServicesSummary({ additionalServices }) {
  if (additionalServices.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Dịch vụ bổ sung</h3>
      <div className="space-y-2">
        {additionalServices.map((service, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>{service.name}</span>
            <div className="text-right">
              <span className="text-sm text-gray-600">Số lượng: {service.quantity}</span>
              <p className="font-medium">{(service.price * service.quantity).toLocaleString()} đ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}