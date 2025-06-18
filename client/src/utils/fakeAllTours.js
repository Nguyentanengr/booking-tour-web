import { format } from "date-fns"

const allTours = [
  {
    id: 1,
    name: "Singapore - Malaysia (1 đêm tại Singapore)",
    tourCode: "NNSGN221",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Singapore",
    duration: "5N4Đ",
    transportation: "Máy bay",
    price: 14590000,
    discountedPrice: null,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JyMLp4VKADq8h1bWbBc4I8lVn3G1YP.png",
    isBestseller: false,
    averageRating: 4.5,
    departureDates: ["28/05", "03/06", "04/06", "10/06", "17/06"],
    isPromoted: true,
  },
  {
    id: 2,
    name: "Phú Quốc - Thiên đường biển đảo",
    tourCode: "PQ002",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Phú Quốc",
    duration: "4N3Đ",
    transportation: "Máy bay",
    price: 6590000,
    discountedPrice: 5590000,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: true,
    averageRating: 4.8,
    departureDates: ["01/06", "08/06", "15/06", "22/06"],
    isPromoted: false,
  },
  {
    id: 3,
    name: "Đà Lạt - Thành phố ngàn hoa",
    tourCode: "DL003",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Đà Lạt",
    duration: "3N2Đ",
    transportation: "Xe khách",
    price: 2590000,
    discountedPrice: null,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: true,
    averageRating: 4.3,
    departureDates: ["30/05", "06/06", "13/06", "20/06"],
    isPromoted: false,
  },
  {
    id: 4,
    name: "Hà Nội - Hạ Long - Ninh Bình",
    tourCode: "HN004",
    startingProvince: "Hà Nội",
    destinationProvince: "Hạ Long",
    duration: "4N3Đ",
    transportation: "Xe khách",
    price: 4590000,
    discountedPrice: 3990000,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: false,
    averageRating: 4.6,
    departureDates: ["02/06", "09/06", "16/06", "23/06"],
    isPromoted: true,
  },
  {
    id: 5,
    name: "Nha Trang - Đà Lạt",
    tourCode: "NT005",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Nha Trang",
    duration: "5N4Đ",
    transportation: "Máy bay",
    price: 7890000,
    discountedPrice: null,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: true,
    averageRating: 4.4,
    departureDates: ["05/06", "12/06", "19/06", "26/06"],
    isPromoted: false,
  },
  {
    id: 6,
    name: "Sapa - Fansipan - Bản Cát Cát",
    tourCode: "SP006",
    startingProvince: "Hà Nội",
    destinationProvince: "Sapa",
    duration: "3N2Đ",
    transportation: "Xe khách",
    price: 3290000,
    discountedPrice: 2890000,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: true,
    averageRating: 4.7,
    departureDates: ["07/06", "14/06", "21/06", "28/06"],
    isPromoted: true,
  },
  {
    id: 7,
    name: "Hội An - Bà Nà Hills - Huế",
    tourCode: "HA007",
    startingProvince: "Đà Nẵng",
    destinationProvince: "Hội An",
    duration: "4N3Đ",
    transportation: "Xe khách",
    price: 5190000,
    discountedPrice: null,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: false,
    averageRating: 4.2,
    departureDates: ["10/06", "17/06", "24/06", "01/07"],
    isPromoted: false,
  },
  {
    id: 8,
    name: "Cần Thơ - Chợ nổi Cái Răng",
    tourCode: "CT008",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Cần Thơ",
    duration: "2N1Đ",
    transportation: "Xe khách",
    price: 1890000,
    discountedPrice: 1590000,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: false,
    averageRating: 4.1,
    departureDates: ["12/06", "19/06", "26/06", "03/07"],
    isPromoted: true,
  },
  {
    id: 9,
    name: "Vũng Tàu - Hòn Bà - Long Hải",
    tourCode: "VT009",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Vũng Tàu",
    duration: "2N1Đ",
    transportation: "Xe khách",
    price: 2190000,
    discountedPrice: null,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: false,
    averageRating: 4.0,
    departureDates: ["15/06", "22/06", "29/06", "06/07"],
    isPromoted: false,
  },
  {
    id: 10,
    name: "Mũi Né - Phan Thiết",
    tourCode: "MN010",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Phan Thiết",
    duration: "3N2Đ",
    transportation: "Xe khách",
    price: 3590000,
    discountedPrice: 2990000,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: true,
    averageRating: 4.5,
    departureDates: ["18/06", "25/06", "02/07", "09/07"],
    isPromoted: true,
  },
  {
    id: 11,
    name: "Côn Đảo - Hòn đảo thiêng liêng",
    tourCode: "CD011",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Côn Đảo",
    duration: "3N2Đ",
    transportation: "Máy bay",
    price: 8590000,
    discountedPrice: null,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: false,
    averageRating: 4.6,
    departureDates: ["20/06", "27/06", "04/07", "11/07"],
    isPromoted: false,
  },
  {
    id: 12,
    name: "Quy Nhon - Eo Gió - Kỳ Co",
    tourCode: "QN012",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Quy Nhon",
    duration: "4N3Đ",
    transportation: "Máy bay",
    price: 6890000,
    discountedPrice: 5990000,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: true,
    averageRating: 4.4,
    departureDates: ["22/06", "29/06", "06/07", "13/07"],
    isPromoted: true,
  },
  {
    id: 13,
    name: "Tây Ninh - Núi Bà Đen - Cao Đài",
    tourCode: "TN013",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Tây Ninh",
    duration: "1N0Đ",
    transportation: "Xe khách",
    price: 890000,
    discountedPrice: null,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: false,
    averageRating: 3.9,
    departureDates: ["25/06", "02/07", "09/07", "16/07"],
    isPromoted: false,
  },
  {
    id: 14,
    name: "Bình Thuận - Làng chài Mũi Né",
    tourCode: "BT014",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "Bình Thuận",
    duration: "2N1Đ",
    transportation: "Xe khách",
    price: 2490000,
    discountedPrice: 1990000,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: false,
    averageRating: 4.2,
    departureDates: ["28/06", "05/07", "12/07", "19/07"],
    isPromoted: true,
  },
  {
    id: 15,
    name: "An Giang - Núi Sam - Chùa Bà",
    tourCode: "AG015",
    startingProvince: "TP. Hồ Chí Minh",
    destinationProvince: "An Giang",
    duration: "2N1Đ",
    transportation: "Xe khách",
    price: 1790000,
    discountedPrice: null,
    image: "/placeholder.svg?height=300&width=400",
    isBestseller: false,
    averageRating: 4.0,
    departureDates: ["30/06", "07/07", "14/07", "21/07"],
    isPromoted: false,
  },
]

export const fetchTours = async ({
  searchTerm,
  sortBy,
  filters,
  page,
  limit,
}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filtered = [...allTours]

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (tour) =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.tourCode.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Apply other filters
  filtered = filtered.filter((tour) => {
    // Price range filter
    if (filters.priceRange) {
      const price = tour.discountedPrice || tour.price
      switch (filters.priceRange) {
        case "under-5m":
          if (price >= 5000000) return false
          break
        case "5m-10m":
          if (price < 5000000 || price >= 10000000) return false
          break
        case "10m-20m":
          if (price < 10000000 || price >= 20000000) return false
          break
        case "over-20m":
          if (price < 20000000) return false
          break
      }
    }

    // Duration filter
    if (filters.duration) {
      switch (filters.duration) {
        case "1-day":
          if (!tour.duration.includes("1N0Đ")) return false
          break
        case "2n1d":
          if (!tour.duration.includes("2N1Đ")) return false
          break
        case "3n2d":
          if (!tour.duration.includes("3N2Đ")) return false
          break
        case "4n3d":
          if (!tour.duration.includes("4N3Đ")) return false
          break
        case "5n4d":
          if (!tour.duration.includes("5N4Đ")) return false
          break
        case "over-5d":
          const numDays = parseInt(tour.duration.split('N')[0]);
          if (isNaN(numDays) || numDays <= 5) return false
          break;
      }
    }

    // Starting province filter
    if (filters.startingProvince) {
      const provinceMap = {
        hcm: "TP. Hồ Chí Minh",
        hanoi: "Hà Nội",
        danang: "Đà Nẵng",
        cantho: "Cần Thơ",
      }
      if (tour.startingProvince !== provinceMap[filters.startingProvince]) return false
    }

    // Destination filter (added based on original component logic)
    if (filters.destination) {
      const destinationMap = {
        singapore: "Singapore",
        phuquoc: "Phú Quốc",
        dalat: "Đà Lạt",
        nhatrang: "Nha Trang",
        halong: "Hạ Long",
      };
      if (tour.destinationProvince !== destinationMap[filters.destination]) return false;
    }

    // Transportation filter
    if (filters.transportation) {
      const transportMap = {
        plane: "Máy bay",
        bus: "Xe khách",
        train: "Tàu hỏa",
      }
      if (tour.transportation !== transportMap[filters.transportation]) return false
    }

    // Rating filter
    if (filters.rating) {
      switch (filters.rating) {
        case "5-star":
          if (tour.averageRating < 5) return false
          break
        case "4-star":
          if (tour.averageRating < 4) return false
          break
        case "3-star":
          if (tour.averageRating < 3) return false
          break
      }
    }

    // Bestseller filter
    if (filters.bestsellerOnly && !tour.isBestseller) {
      return false
    }

    // Departure Date filter
    if (filters.departureDate) {
      const selectedDateFormatted = format(filters.departureDate, "dd/MM");
      if (!tour.departureDates.includes(selectedDateFormatted)) return false;
    }

    return true
  })

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
      case "price-desc":
        return (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
      case "rating":
        return b.averageRating - a.averageRating
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "newest": // Assuming "newest" sorts by the earliest departure date first
        const dateA = new Date(a.departureDates[0].split('/').reverse().join('-'));
        const dateB = new Date(b.departureDates[0].split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      default:
        return 0
    }
  })

  const totalTours = filtered.length
  const totalPages = Math.ceil(totalTours / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedTours = filtered.slice(startIndex, endIndex)

  return {
    tours: paginatedTours,
    totalTours,
    totalPages,
  }
}