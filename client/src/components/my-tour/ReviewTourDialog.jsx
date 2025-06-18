import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Star, Upload, X } from "lucide-react"

export function ReviewTourDialog({ isOpen, onClose, tour, onSubmitReview, isSubmitting }) {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [reviewImages, setReviewImages] = useState([])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    setReviewImages((prev) => [...prev, ...files].slice(0, 5)) // Max 5 images
  }

  const removeImage = (index) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (rating === 0) return
    onSubmitReview(tour.id, rating, reviewText, reviewImages)
    setRating(0)
    setReviewText("")
    setReviewImages([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Đánh giá tour</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn về chuyến du lịch này
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Đánh giá tổng thể *</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    size={24}
                    className={
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="review-text">Nhận xét</Label>
            <Textarea
              id="review-text"
              placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label>Hình ảnh (tối đa 5 ảnh)</Label>
            <div className="mt-2">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="review-images"
              />
              <label
                htmlFor="review-images"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Nhấn để tải ảnh lên</p>
                </div>
              </label>
            </div>

            {reviewImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {reviewImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Review ${index + 1}`}
                      className="w-full h-16 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}