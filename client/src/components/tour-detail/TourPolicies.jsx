import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TourPolicies({ policies }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Chính sách tour</h2>
      <Tabs defaultValue="transportation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transportation">Vận chuyển</TabsTrigger>
          <TabsTrigger value="cancellation">Hủy tour</TabsTrigger>
          <TabsTrigger value="booking">Đặt tour</TabsTrigger>
          <TabsTrigger value="refund">Hoàn tiền</TabsTrigger>
        </TabsList>
        <TabsContent value="transportation" className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{policies.transportation}</p>
          </div>
        </TabsContent>
        <TabsContent value="cancellation" className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{policies.cancellation}</p>
          </div>
        </TabsContent>
        <TabsContent value="booking" className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{policies.booking}</p>
          </div>
        </TabsContent>
        <TabsContent value="refund" className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{policies.refund}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}