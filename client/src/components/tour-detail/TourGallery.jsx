import React from "react";

export default function TourGallery({ images, selectedImage, setSelectedImage, tourName }) {
  return (
    <div className="space-y-4">
      <div className="relative h-[400px] rounded-lg overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={tourName}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative h-20 rounded-lg overflow-hidden border-2 ${
              selectedImage === index ? "border-blue-600" : "border-gray-200"
            }`}
          >
            <img
              src={image}
              alt={`Tour image ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}