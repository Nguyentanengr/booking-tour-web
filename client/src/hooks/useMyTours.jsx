import { useState, useEffect } from "react"
import * as api from "@/utils/fakeMyTours.js" // Import your mock API

export function useMyTours() {
  const [myTours, setMyTours] = useState({
    upcoming: [],
    completed: [],
    cancelled: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true)
        const data = await api.fetchMyTours()
        setMyTours(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTours()
  }, [])

  const cancelTour = async (tourId, reason) => {
    setIsCancelling(true)
    try {
      const success = await api.cancelTour(tourId, reason)
      if (success) {
        // Optimistically update UI or re-fetch data
        setMyTours((prevTours) => {
          const cancelledTour = prevTours.upcoming.find((tour) => tour.id === tourId)
          if (cancelledTour) {
            return {
              ...prevTours,
              upcoming: prevTours.upcoming.filter((tour) => tour.id !== tourId),
              cancelled: [
                {
                  ...cancelledTour,
                  status: "processing", // Or "cancelled" if handled immediately by API
                  cancelDate: new Date(),
                  refundAmount: cancelledTour.price * 0.8, // Example refund
                },
                ...prevTours.cancelled,
              ],
            }
          }
          return prevTours
        })
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to cancel tour:", err)
      return false
    } finally {
      setIsCancelling(false)
    }
  }

  const submitReview = async (tourId, rating, reviewText, reviewImages) => {
    setIsSubmittingReview(true)
    try {
      const success = await api.submitReview(tourId, rating, reviewText, reviewImages)
      if (success) {
        setMyTours((prevTours) => {
          const updatedCompleted = prevTours.completed.map((tour) =>
            tour.id === tourId ? { ...tour, rating: rating } : tour
          )
          return {
            ...prevTours,
            completed: updatedCompleted,
          }
        })
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to submit review:", err)
      return false
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return { myTours, loading, error, cancelTour, submitReview, isCancelling, isSubmittingReview }
}