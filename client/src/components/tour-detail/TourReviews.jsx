// components/TourReviews.jsx
import React from "react";
import { Star } from "lucide-react";

export default function TourReviews({ averageRating, reviewCount, reviews }) {
  // Mock distribution for star ratings based on initial data (approximate percentages)
  const calculateStarDistribution = (totalReviews) => {
    const dist = {};
    dist[5] = Math.round(totalReviews * 0.60); // 60%
    dist[4] = Math.round(totalReviews * 0.25); // 25%
    dist[3] = Math.round(totalReviews * 0.10); // 10%
    dist[2] = Math.round(totalReviews * 0.03); // 3%
    dist[1] = Math.round(totalReviews * 0.02); // 2%
    return dist;
  };

  const starDistribution = calculateStarDistribution(reviewCount);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <div className="text-sm text-gray-600">{reviewCount} đánh giá</div>
          </div>
          <div className="flex-1">
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-8">{star} sao</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(starDistribution[star] / reviewCount) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{starDistribution[star]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-medium text-blue-600">{review.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.name}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="flex gap-2">
                    {review.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Review image ${imgIndex + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}