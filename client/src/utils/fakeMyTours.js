const mockTours = {
  upcoming: [
    {
      id: 1,
      name: "Hà Nội - Hạ Long - Ninh Bình",
      tourCode: "HN567",
      departureDate: new Date(2024, 5, 10),
      returnDate: new Date(2024, 5, 15),
      duration: "5N4Đ",
      transportation: "Máy bay",
      price: 8990000,
      status: "confirmed",
      image: "/placeholder.svg?height=200&width=300",
      passengers: 2,
    },
  ],
  completed: [
    {
      id: 2,
      name: "Phú Quốc - Thiên đường biển đảo",
      tourCode: "PQ234",
      departureDate: new Date(2024, 2, 15),
      returnDate: new Date(2024, 2, 19),
      duration: "4N3Đ",
      transportation: "Máy bay",
      price: 6590000,
      status: "completed",
      image: "/placeholder.svg?height=200&width=300",
      passengers: 2,
      rating: null,
    },
  ],
  cancelled: [
    {
      id: 3,
      name: "Đà Nẵng - Hội An - Huế",
      tourCode: "DN789",
      departureDate: new Date(2024, 3, 20),
      returnDate: new Date(2024, 3, 24),
      duration: "4N3Đ",
      transportation: "Máy bay",
      price: 5790000,
      status: "cancelled",
      image: "/placeholder.svg?height=200&width=300",
      passengers: 2,
      cancelDate: new Date(2024, 3, 15),
      refundAmount: 4632000,
    },
  ],
}

export const fetchMyTours = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(mockTours))) // Return a deep copy
    }, 500) // Simulate network delay
  })
}

export const cancelTour = async (tourId, reason) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API: Cancelling tour ${tourId} with reason: ${reason}`)
      // In a real app, you'd update a database.
      // Here, we simulate success.
      resolve(true)
    }, 1000)
  })
}

export const submitReview = async (tourId, rating, reviewText, reviewImages) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API: Submitting review for tour ${tourId}:`, {
        rating,
        reviewText,
        imageCount: reviewImages.length,
      })
      // In a real app, you'd update a database.
      // Here, we simulate success.
      resolve(true)
    }, 1000)
  })
}