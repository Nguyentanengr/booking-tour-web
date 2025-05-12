import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getTours } from '../redux/slices/tourSlice';
import TourCard from '../components/TourCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const dispatch = useDispatch();
  const { tours, loading, error } = useSelector((state) => state.tours);

  useEffect(() => {
    dispatch(getTours());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Các Tour Du Lịch Nổi Bật</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

export default Home;
