// src/components/ActionButtons.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {/* Thay thế Next.js Link bằng thẻ <a> hoặc component Link của react-router-dom */}
      <a href="/">
        <Button variant="outline" className="w-full sm:w-auto">
          <Home className="h-4 w-4 mr-2" />
          Về trang chủ
        </Button>
      </a>
      <a href="/tour-cua-toi"> 
        <Button className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700">
          <MapPin className="h-4 w-4 mr-2" />
          Xem My Tour
        </Button>
      </a>
    </div>
  );
}