
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContactForm } from "@/hooks/useContactForm"; // Adjust path as needed

const ContactForm = () => {
  const { formData, handleChange, handleSelectChange, handleSubmit, loading, error, success } = useContactForm();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-6">Gửi tin nhắn cho chúng tôi</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Nguyễn Văn A"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0912345678"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Chủ đề</Label>
          <Select value={formData.subject} onValueChange={handleSelectChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn chủ đề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booking">Đặt tour</SelectItem>
              <SelectItem value="info">Thông tin tour</SelectItem>
              <SelectItem value="payment">Thanh toán</SelectItem>
              <SelectItem value="complaint">Khiếu nại</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Nội dung</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Nhập nội dung tin nhắn của bạn"
            rows={10}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error.message}</p>}
        {success && <p className="text-green-500 text-sm">Gửi liên hệ thành công!</p>}

        <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi tin nhắn"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;