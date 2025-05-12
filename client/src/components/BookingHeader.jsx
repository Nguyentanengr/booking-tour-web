import { Link } from 'react-router-dom';

const BookingHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-bold">Tour Du Lịch</Link>
        <nav>
          <ul className="flex space-x-8">
            <li><Link to="/" className="text-white hover:text-gray-200">Home</Link></li>
            <li><Link to="/about" className="text-white hover:text-gray-200">About</Link></li>
            <li><Link to="/contact" className="text-white hover:text-gray-200">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default BookingHeader;
