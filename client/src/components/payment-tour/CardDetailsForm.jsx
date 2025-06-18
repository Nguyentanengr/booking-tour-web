import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CardDetailsForm({ cardInfo, handleCardInfoChange, formatCardNumber, formatExpiryDate }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Thông tin thẻ</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Số thẻ *</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardInfo.cardNumber}
            onChange={(e) => handleCardInfoChange("cardNumber", formatCardNumber(e.target.value))}
            maxLength={19}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Tên chủ thẻ *</Label>
          <Input
            id="cardholderName"
            placeholder="NGUYEN VAN A"
            value={cardInfo.cardholderName}
            onChange={(e) => handleCardInfoChange("cardholderName", e.target.value.toUpperCase())}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={cardInfo.expiryDate}
              onChange={(e) => handleCardInfoChange("expiryDate", formatExpiryDate(e.target.value))}
              maxLength={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV *</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={cardInfo.cvv}
              onChange={(e) => handleCardInfoChange("cvv", e.target.value.replace(/\D/g, ""))}
              maxLength={4}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}