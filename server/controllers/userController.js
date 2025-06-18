const User = require('../models/UsersModel');
const Tour = require('../models/ToursModel');
const Booking = require('../models/BookingsModel');
const Departure = require('../models/DeparturesModel');
const Cancellation = require('../models/CancellationsModel');
const log4js = require('log4js');
const logger = log4js.getLogger();


const getFavoriteTours = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
                           .populate({
                                path: 'favoriteTours.tourId', // Updated to camelCase
                                select: 'tourCode name images duration representativePrice averageRating isBestseller', // Updated to camelCase
                                populate: [
                                    { path: 'startingProvince', select: 'description' }, // Updated to camelCase
                                    { path: 'destinationProvince', select: 'description' } // Updated to camelCase
                                ]
                           })
                           .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteTours = user.favoriteTours // Updated to camelCase
                              .filter(fav => fav.tourId && fav.tourId.deletedAt === null) // Updated to camelCase
                              .map(fav => {
                                const tour = fav.tourId;
                                return {
                                  _id: tour._id,
                                  tourCode: tour.tourCode, // Updated to camelCase
                                  name: tour.name,
                                  image: tour.images && tour.images.length > 0 ? tour.images[0] : null,
                                  duration: tour.duration,
                                  startingProvince: tour.startingProvince ? tour.startingProvince.description : null, // Updated to camelCase
                                  destinationProvince: tour.destinationProvince ? tour.destinationProvince.description : null, // Updated to camelCase
                                  price: tour.representativePrice.discountedPrice, // Updated to camelCase
                                  averageRating: tour.averageRating, // Updated to camelCase
                                  isBestseller: tour.isBestseller, // Updated to camelCase
                                  addedAt: fav.addedAt // Updated to camelCase
                                };
                              });

    res.status(200).json(favoriteTours);
  } catch (error) {
    console.error("Error getting favorite tours:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getTourHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await Booking.find({
        "user.userId": userId, // Updated to camelCase
        deletedAt: null // Updated to camelCase
    })
    .populate({
        path: 'tourId', // Updated to camelCase
        select: 'tourCode name images duration representativePrice averageRating isBestseller', // Updated to camelCase
        populate: [
            { path: 'startingProvince', select: 'description' }, // Updated to camelCase
            { path: 'destinationProvince', select: 'description' } // Updated to camelCase
        ]
    })
    .populate('departureId', 'departureDate returnDate') // Updated to camelCase
    .lean();

    const pendingBookings = [];
    const completedBookings = [];
    const cancelledBookings = [];

    for (const booking of bookings) {
        if (!booking.tourId || booking.tourId.deletedAt !== null || // Updated to camelCase
            !booking.departureId || booking.departureId.deletedAt !== null) { // Updated to camelCase
            continue;
        }

        const baseInfo = {
            _id: booking._id,
            totalPrice: booking.totalPrice, // Updated to camelCase
            status: booking.status,
            createdAt: booking.createdAt, // Updated to camelCase
            tourId: booking.tourId._id, // Updated to camelCase
            tourCode: booking.tourId.tourCode, // Updated to camelCase
            tourName: booking.tourId.name,
            tourImage: booking.tourId.images && booking.tourId.images.length > 0 ? booking.tourId.images[0] : null,
            tourDuration: booking.tourId.duration,
            startingProvince: booking.tourId.startingProvince ? booking.tourId.startingProvince.description : null, // Updated to camelCase
            destinationProvince: booking.tourId.destinationProvince ? booking.tourId.destinationProvince.description : null, // Updated to camelCase
            departureDate: booking.departureId.departureDate, // Updated to camelCase
            returnDate: booking.departureId.returnDate, // Updated to camelCase
            passengersCount: booking.passengers ? booking.passengers.length : 0
        };

        if (booking.status === 'confirmed' || booking.status === 'paid') {
            pendingBookings.push({
                ...baseInfo,
                bookingDetails: { // Updated to camelCase
                    passengers: booking.passengers,
                    additionalServices: booking.additionalServices // Updated to camelCase
                }
            });
        } else if (booking.status === 'completed') {
            completedBookings.push(baseInfo);
        } else if (booking.status === 'cancelled') {
            const cancellationInfo = await Cancellation.findOne({ bookingId: booking._id, deletedAt: null }).lean(); // Updated to camelCase
            cancelledBookings.push({
                ...baseInfo,
                cancellationDetails: cancellationInfo ? { // Updated to camelCase
                    cancellationReason: cancellationInfo.cancellationReason, // Updated to camelCase
                    refundAmount: cancellationInfo.refundAmount, // Updated to camelCase
                    cancellationStatus: cancellationInfo.status, // Updated to camelCase
                    cancelledAt: cancellationInfo.createdAt // Updated to camelCase
                } : null
            });
        }
    }

    res.status(200).json({
      pending: pendingBookings,
      completed: completedBookings,
      cancelled: cancelledBookings
    });
  } catch (error) {
    console.error("Error getting tour history:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, phoneNumber, email, avatarUrl, dateOfBirth, gender } = req.body; // Updated to camelCase

    const updateFields = {};

    if (fullName !== undefined) updateFields.fullName = fullName; // Updated to camelCase
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber; // Updated to camelCase
    if (email !== undefined) updateFields.email = email;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl; // Updated to camelCase
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = new Date(dateOfBirth); // Updated to camelCase
    if (gender !== undefined) updateFields.gender = gender;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, deletedAt: null }, // Updated to camelCase
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found or no changes made.' });
    }

    res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // ID của người dùng được lấy từ token sau khi xác thực
    logger.info("11111111",req.user)
    
    // Tìm người dùng trong database và không trả về mật khẩu
    const user = await User.findById(userId).select('-password').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const addFavoriteTour = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tourId } = req.params; // Lấy tourId từ params

    // Kiểm tra xem tour có tồn tại và không bị xóa mềm không
    const tour = await Tour.findById(tourId);
    if (!tour || tour.deletedAt !== null) {
      return res.status(404).json({ message: 'Tour not found.' });
    }

    // Kiểm tra xem tour đã có trong danh sách yêu thích chưa
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isAlreadyFavorite = user.favoriteTours.some(
      (fav) => fav.tourId.toString() === tourId
    );

    if (isAlreadyFavorite) {
      return res.status(400).json({ message: 'Tour is already in your favorites.' });
    }

    // Thêm tour vào danh sách yêu thích
    user.favoriteTours.push({ tourId: tourId, addedAt: new Date() });
    await user.save();

    // Tùy chọn: Gửi thông báo nếu muốn
    await Notification.create({
      recipientType: "user",
      recipientId: userId,
      type: "favorite_added",
      title: "Đã thêm tour vào danh sách yêu thích",
      message: `Bạn đã thêm tour "${tour.name}" vào danh sách yêu thích thành công.`,
      status: "unread",
    });

    res.status(200).json({ message: 'Tour added to favorites successfully.' });
  } catch (error) {
    console.error("Error adding tour to favorites:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const removeFavoriteTour = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tourId } = req.params; // Lấy tourId từ params

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Lọc bỏ tour khỏi danh sách yêu thích
    const initialFavoriteCount = user.favoriteTours.length;
    user.favoriteTours = user.favoriteTours.filter(
      (fav) => fav.tourId.toString() !== tourId
    );

    if (user.favoriteTours.length === initialFavoriteCount) {
      return res.status(404).json({ message: 'Tour not found in your favorites.' });
    }

    await user.save();

    // Tùy chọn: Gửi thông báo nếu muốn
    const tour = await Tour.findById(tourId); // Để lấy tên tour cho thông báo
    if (tour) {
        await Notification.create({
            recipientType: "user",
            recipientId: userId,
            type: "favorite_removed",
            title: "Đã xóa tour khỏi danh sách yêu thích",
            message: `Bạn đã xóa tour "${tour.name}" khỏi danh sách yêu thích.`,
            status: "unread",
        });
    }


    res.status(200).json({ message: 'Tour removed from favorites successfully.' });
  } catch (error) {
    console.error("Error removing tour from favorites:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
module.exports = {
getUserProfile,
addFavoriteTour,
removeFavoriteTour,
  getFavoriteTours,
  getTourHistory,
  updateUserProfile
}