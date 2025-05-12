const TourCard = ({ tour }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
      <img src={tour.image} alt={tour.name} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-2xl font-semibold text-gray-800">{tour.name}</h3>
        <p className="mt-2 text-gray-600">{tour.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-semibold text-blue-500">${tour.price}</span>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
