import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

export function PassengerCountSelection({ passengerCounts, updatePassengerCount }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Số lượng hành khách</h2>
      <div className="space-y-4">
        {/* Adult */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Người lớn</p>
            <p className="text-sm text-gray-600">Từ 12 tuổi trở lên</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updatePassengerCount("adult", false)}
              disabled={passengerCounts.adult <= 1}
            >
              <Minus size={16} />
            </Button>
            <span className="w-8 text-center font-medium">{passengerCounts.adult}</span>
            <Button variant="outline" size="icon" onClick={() => updatePassengerCount("adult", true)}>
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Child */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Trẻ em</p>
            <p className="text-sm text-gray-600">Từ 2-11 tuổi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updatePassengerCount("child", false)}
              disabled={passengerCounts.child <= 0}
            >
              <Minus size={16} />
            </Button>
            <span className="w-8 text-center font-medium">{passengerCounts.child}</span>
            <Button variant="outline" size="icon" onClick={() => updatePassengerCount("child", true)}>
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Senior */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Người cao tuổi</p>
            <p className="text-sm text-gray-600">Từ 65 tuổi trở lên</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updatePassengerCount("senior", false)}
              disabled={passengerCounts.senior <= 0}
            >
              <Minus size={16} />
            </Button>
            <span className="w-8 text-center font-medium">{passengerCounts.senior}</span>
            <Button variant="outline" size="icon" onClick={() => updatePassengerCount("senior", true)}>
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}