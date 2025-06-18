
import React, { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Phone } from "lucide-react"
import { Toaster, toast } from "sonner" 

import { useMyTours } from "@/hooks/useMyTours" // Import the custom hook
import { TourCard } from "@/components/my-tour/TourCard" // Import TourCard component
import { CancelTourDialog } from "@/components/my-tour/CancelTourDialog" // Import CancelTourDialog
import { ReviewTourDialog } from "@/components/my-tour/ReviewTourDialog" // Import ReviewTourDialog

export default function MyToursPage() {
  const {
    myTours,
    cancelTour,
    submitReview,
    isCancelling,
    isSubmittingReview,
  } = useMyTours()

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)

  const totalTours =
    myTours.upcoming.length + myTours.completed.length + myTours.cancelled.length

  const handleCancelRequest = async (tourId, reason) => {
    const success = await cancelTour(tourId, reason)
    if (success) {
      toast.success("Yêu cầu hủy tour đã được gửi. Chúng tôi sẽ xử lý trong vòng 24h.")
    } else {
      toast.error("Có lỗi xảy ra khi gửi yêu cầu hủy tour.")
    }
    setShowCancelDialog(false)
    setSelectedTour(null)
  }

  const handleSubmitReviewRequest = async (tourId, rating, reviewText, reviewImages) => {
    const success = await submitReview(tourId, rating, reviewText, reviewImages)
    if (success) {
      toast.success("Đánh giá của bạn đã được gửi thành công!")
    } else {
      toast.error("Có lỗi xảy ra khi gửi đánh giá.")
    }
    setShowReviewDialog(false)
    setSelectedTour(null)
  }

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <Toaster position="top-right" richColors /> {/* Add Toaster component */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">My Tour</h1>
        <Badge variant="secondary">{totalTours} tour</Badge>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar size={16} />
            Sắp tới ({myTours.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <MapPin size={16} />
            Đã hoàn thành ({myTours.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <Phone size={16} />
            Đã hủy ({myTours.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {myTours.upcoming.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Không có tour sắp tới</h2>
              <p className="text-gray-500 mb-6">Hãy đặt tour mới để bắt đầu chuyến phiêu lưu</p>
              <Link to="/danh-sach-tour">
                <Button>Đặt tour ngay</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {myTours.upcoming.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onCancelClick={() => {
                    setSelectedTour(tour)
                    setShowCancelDialog(true)
                  }}
                  type="upcoming"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {myTours.completed.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa có tour đã hoàn thành</h2>
              <p className="text-gray-500">Các tour đã hoàn thành sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myTours.completed.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onReviewClick={() => {
                    setSelectedTour(tour)
                    setShowReviewDialog(true)
                  }}
                  type="completed"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {myTours.cancelled.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Không có tour đã hủy</h2>
              <p className="text-gray-500">Các tour đã hủy sẽ hiển thị ở đây</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myTours.cancelled.map((tour) => (
                <TourCard key={tour.id} tour={tour} type="cancelled" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedTour && (
        <>
          <CancelTourDialog
            isOpen={showCancelDialog}
            onClose={() => setShowCancelDialog(false)}
            tour={selectedTour}
            onConfirmCancel={handleCancelRequest}
            isCancelling={isCancelling}
          />
          <ReviewTourDialog
            isOpen={showReviewDialog}
            onClose={() => setShowReviewDialog(false)}
            tour={selectedTour}
            onSubmitReview={handleSubmitReviewRequest}
            isSubmitting={isSubmittingReview}
          />
        </>
      )}
    </div>
  )
}