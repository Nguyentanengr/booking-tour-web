import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import ContactInfoCard from "@/components/contact/ContactInfoCard"; // Adjust path as needed
import ContactForm from "@/components/contact/ContactForm"; // Adjust path as needed

export default function ContactPage() {
  return (
    <div className="w-[1400px] mx-auto container py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Liên hệ với chúng tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <ContactInfoCard icon={MapPin} title="Địa chỉ">
          <p className="text-gray-600">123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
        </ContactInfoCard>

        <ContactInfoCard icon={Phone} title="Điện thoại">
          <p className="text-gray-600">Hotline: 1900 1234</p>
          <p className="text-gray-600">Hỗ trợ: 0912 345 678</p>
        </ContactInfoCard>

        <ContactInfoCard icon={Mail} title="Email">
          <p className="text-gray-600">info@dulichviet.com</p>
          <p className="text-gray-600">support@dulichviet.com</p>
        </ContactInfoCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContactForm />

        <div>
          <ContactInfoCard icon={Clock} title="Giờ làm việc">
            <p className="text-gray-600 mb-1">Thứ Hai - Thứ Sáu: 8:00 - 17:30</p>
            <p className="text-gray-600 mb-1">Thứ Bảy: 8:00 - 12:00</p>
            <p className="text-gray-600">Chủ Nhật: Đóng cửa</p>
          </ContactInfoCard>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-[400px] mt-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.499645063076!2d106.69742617468164!3d10.77154248937517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f360c7f1a7d%3A0x6b44a7f0e3e2d6b!2sNguyen%20Hue%20Walking%20Street!5e0!3m2!1sen!2svn!4v1700000000000!5m2!1sen!2svn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}