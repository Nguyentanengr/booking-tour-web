// src/components/TotalAmountSummary.jsx
import React from "react";
import { Separator } from "@/components/ui/separator";

export function TotalAmountSummary({ totalPrice }) {
  return (
    <>
      <Separator className="my-6" />
      <div className="flex justify-between items-center text-xl font-bold">
        <span>Tổng giá trị:</span>
        <span className="text-red-600">{totalPrice.toLocaleString()} đ</span>
      </div>
    </>
  );
}