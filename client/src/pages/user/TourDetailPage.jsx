// TourDetailPage.jsx
import { useState, useRef, useEffect, use } from "react";
import { useParams } from 'react-router-dom';
import { fetchTourDetail, fetchDepartures, fetchReviews, fetchRelatedTours } from "@/utils/fakeTourDetail.js";

// Import components
import TourHeader from "@/components/tour-detail/TourHeader";
import TourGallery from "@/components/tour-detail/TourGallery";
import DepartureTable from "@/components/tour-detail/DepartureTable";
import TourDescriptionAndServices from "@/components/tour-detail/TourDescriptionAndServices";
import TourItinerary from "@/components/tour-detail/TourItinerary";
import TourPolicies from "@/components/tour-detail/TourPolicies";
import TourReviews from "@/components/tour-detail/TourReviews";
import BookingSidebar from "@/components/tour-detail/BookingSidebar";
import RelatedTours from "@/components/tour-detail/RelatedTours";

export default function TourDetailPage() {
  const [tourDetail, setTourDetail] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [relatedTours, setRelatedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const departureTableRef = useRef(null);
  

  const {tourId} = useParams(); 

  useEffect(() => {
    const loadTourData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tourRes, departuresRes, reviewsRes, relatedToursRes] = await Promise.all([
          fetchTourDetail(tourId),
          fetchDepartures(tourId),
          fetchReviews(tourId),
          fetchRelatedTours(),
        ]);

        if (tourRes.success) {
          setTourDetail(tourRes.data);
        } else {
          setError(tourRes.error);
        }

        if (departuresRes.success) {
          setDepartures(departuresRes.data);
        } else {
          setError(prev => prev ? prev + "; " + departuresRes.error : departuresRes.error);
        }

        if (reviewsRes.success) {
          setReviews(reviewsRes.data);
        } else {
          setError(prev => prev ? prev + "; " + reviewsRes.error : reviewsRes.error);
        }

        if (relatedToursRes.success) {
          setRelatedTours(relatedToursRes.data);
        } else {
          setError(prev => prev ? prev + "; " + relatedToursRes.error : relatedToursRes.error);
        }

      } catch (err) {
        setError("Failed to load tour data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTourData();
  }, [tourId]);

  const scrollToDepartureTable = () => {
    departureTableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectDeparture = (departure) => {
    setSelectedDeparture(departure);
  };

  if (loading) {
    return <div className="container py-8 text-center">Đang tải dữ liệu tour...</div>;
  }

  if (error) {
    return <div className="container py-8 text-center text-red-500">Lỗi: {error}</div>;
  }

  if (!tourDetail) {
    return <div className="container py-8 text-center">Không tìm thấy thông tin tour.</div>;
  }

  return (
    <div className="container py-8 w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <TourHeader
            tourDetail={tourDetail}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
          />
          <TourGallery
            images={tourDetail.images}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            tourName={tourDetail.name}
          />
          <DepartureTable
            departures={departures}
            selectedDeparture={selectedDeparture}
            handleSelectDeparture={handleSelectDeparture}
            departureTableRef={departureTableRef}
          />
          <TourDescriptionAndServices
            description={tourDetail.description}
            services={tourDetail.services}
          />
          <TourItinerary
            itinerary={tourDetail.itinerary}
          />
          <TourPolicies
            policies={tourDetail.policies}
          />
          <TourReviews
            averageRating={tourDetail.averageRating}
            reviewCount={tourDetail.reviewCount}
            reviews={reviews}
          />
        </div>

        {/* Sticky Booking Form */}
        <BookingSidebar
          tourDetail={tourDetail}
          selectedDeparture={selectedDeparture}
          scrollToDepartureTable={scrollToDepartureTable}
        />
      </div>

      {/* Related Tours - Full Width Section */}
      <RelatedTours tours={relatedTours} />
    </div>
  );
}