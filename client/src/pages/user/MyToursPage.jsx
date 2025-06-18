import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Phone } from "lucide-react";

import { useMyTours } from "@/hooks/useMyTours"; // Adjust path as needed
import TourCard from "@/components/my-tour/TourCard"; // Adjust path as needed
import EmptyState from "@/components/my-tour/EmptyState"; // Adjust path as needed

export default function MyToursPage() {
  const { tours, loading, error } = useMyTours();

  const totalTours =
    tours.upcoming.length + tours.completed.length + tours.cancelled.length;

  if (loading) {
    return <div className="container py-8 text-center">Đang tải tour của bạn...</div>;
  }

  if (error) {
    return <div className="container py-8 text-center text-red-500">Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">My Tour</h1>
        <Badge variant="secondary">{totalTours} tour</Badge>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar size={16} />
            Sắp tới ({tours.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <MapPin size={16} />
            Đã hoàn thành ({tours.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <Phone size={16} />
            Đã hủy ({tours.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {tours.upcoming.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Không có tour sắp tới"
              description="Hãy đặt tour mới để bắt đầu chuyến phiêu lưu"
              buttonText="Đặt tour ngay"
              buttonLink="/tours"
            />
          ) : (
            <div className="space-y-6">
              {tours.upcoming.map((tour) => (
                <TourCard key={tour.id} tour={tour} type="upcoming" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {tours.completed.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="Chưa có tour đã hoàn thành"
              description="Các tour đã hoàn thành sẽ hiển thị ở đây"
            />
          ) : (
            <div className="space-y-6">
              {tours.completed.map((tour) => (
                <TourCard key={tour.id} tour={tour} type="completed" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {tours.cancelled.length === 0 ? (
            <EmptyState
              icon={Phone}
              title="Không có tour đã hủy"
              description="Các tour đã hủy sẽ hiển thị ở đây"
            />
          ) : (
            <div className="space-y-6">
              {tours.cancelled.map((tour) => (
                <TourCard key={tour.id} tour={tour} type="cancelled" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}