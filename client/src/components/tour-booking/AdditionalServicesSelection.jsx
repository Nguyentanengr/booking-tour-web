import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Minus, Info } from "lucide-react";

export function AdditionalServicesSelection({ additionalServices, serviceQuantities, updateServiceQuantity }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Dịch vụ bổ sung</h2>
      <div className="space-y-4">
        {additionalServices.map((service) => (
          <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{service.name}</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Info size={14} className="text-blue-600" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">
                          {service.id === 1 &&
                            "Bảo hiểm bổ sung bao gồm tai nạn, y tế và hủy chuyến với mức bồi thường cao hơn."}
                          {service.id === 2 &&
                            "Phòng đơn riêng biệt, không chia sẻ với khách khác. Phù hợp cho khách muốn riêng tư."}
                          {service.id === 3 &&
                            "Nâng cấp lên khách sạn 5 sao với tiện nghi cao cấp và dịch vụ tốt hơn."}
                          {service.id === 4 &&
                            "Tour tham quan đảo Sentosa với nhiều hoạt động giải trí và thể thao."}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-sm text-gray-600">{service.price.toLocaleString()} đ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateServiceQuantity(service.id, false)}
                disabled={(serviceQuantities[service.id] || 0) <= 0}
              >
                <Minus size={16} />
              </Button>
              <span className="w-8 text-center font-medium">{serviceQuantities[service.id] || 0}</span>
              <Button variant="outline" size="icon" onClick={() => updateServiceQuantity(service.id, true)}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}