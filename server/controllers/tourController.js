const log4js = require('log4js');

const {successResponse, errorResponse} = require("../utils/response");
const Tour = require('../models/ToursModel');
const Departure = require('../models/DeparturesModel');
const Review = require('../models/ReviewsModel');
const Booking = require('../models/BookingsModel');
const logger = log4js.getLogger();


const createTour = async (req, res) => {
    try {
        const newTour = new Tour(req.body);
        logger.info('Received new tour from request: ', newTour)
        const savedTour = await newTour.save();

        successResponse(res, savedTour, 201);
    } catch (error) {
        logger.error('Error creating new tour: ', error);
        errorResponse(res, 'Uncategorized error: ' + error.message, 500);
    }
}

const getTours = async (req, res) => {

    try {
        const key = req.query.key ? req.query.key.trim() : '';
        const from = req.query.from ? req.query.from.trim() : '';
        const to = req.query.to ? req.query.to.trim() : '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        logger.info('Received data from request: ', key, from, to, page, limit, '')

        // Xây dựng query tìm kiếm
        const query = { deletedAt: null }; // Lấy về các tour chưa bị xóa
        if (key) {
            query.title = { $regex: key, $options: 'i' }; // không phân biệt hoa thường
        }
        if (from) {
            query.departurePoint = from;
        }
        if (to) {
            query.destination = to;
        }

        // Thực hiện truy vấn
        const total = await Tour.countDocuments(query);
        const tours = await Tour.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .select("title description services departurePoint destination price createdAt")
            .lean(); // Trả về Tour (dữ liệu) ko có chức năng đối tượng -> tối ưu

        const responseData = {
            tours,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        }
        successResponse(res, responseData, 200);
    } catch (error) {
        logger.error('Error getting tours: ', error);
        errorResponse(res, 'Uncategorized error: ' + error.message, 500);
    }
}

const getPopularTours = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const popularTours = await Tour.find({ deletedAt: null }) // Updated to camelCase
      .sort({ totalSlotsBooked: -1, averageRating: -1, createdAt: -1 }) // Updated to camelCase
      .limit(limit)
      .populate('startingProvince', 'description') // Updated to camelCase
      .populate('destinationProvince', 'description') // Updated to camelCase
      .select('tourCode name images duration representativePrice averageRating totalSlotsBooked isBestseller') // Updated to camelCase
      .lean();

    const formattedTours = popularTours.map(tour => ({
      ...tour,
      startingProvince: tour.startingProvince ? tour.startingProvince.description : null, // Updated to camelCase
      destinationProvince: tour.destinationProvince ? tour.destinationProvince.description : null // Updated to camelCase
    }));

    res.status(200).json(formattedTours);
  } catch (error) {
    console.error("Error getting popular tours:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getToursUser = async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      duration,
      transportation,
      startingProvince,
      destinationProvince,
      minRating,
      isBestseller,
      sortBy,
      order,
      page = 1,
      limit = 10
    } = req.query;

    const query = { deletedAt: null }; // Updated to camelCase

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (minPrice || maxPrice) {
      query["representativePrice.discountedPrice"] = {}; // Updated to camelCase
      if (minPrice) {
        query["representativePrice.discountedPrice"].$gte = parseFloat(minPrice); // Updated to camelCase
      }
      if (maxPrice) {
        query["representativePrice.discountedPrice"].$lte = parseFloat(maxPrice); // Updated to camelCase
      }
    }

    if (duration) {
      query.duration = duration;
    }

    if (transportation) {
      query.transportation = transportation;
    }

    if (startingProvince) {
      query.startingProvince = startingProvince; // Updated to camelCase
    }

    if (destinationProvince) {
      query.destinationProvince = destinationProvince; // Updated to camelCase
    }

    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) }; // Updated to camelCase
    }

    if (isBestseller !== undefined) {
      query.isBestseller = isBestseller === 'true'; // Updated to camelCase
    }

    const sortOptions = {};
    if (sortBy === "price") {
      sortOptions["representativePrice.discountedPrice"] = (order === "asc" ? 1 : -1); // Updated to camelCase
    } else if (sortBy === "name") {
      sortOptions.name = (order === "asc" ? 1 : -1);
    } else if (sortBy === "rating") {
      sortOptions.averageRating = (order === "asc" ? 1 : -1); // Updated to camelCase
    } else {
      sortOptions.createdAt = -1; // Updated to camelCase
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tours = await Tour.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('startingProvince', 'description') // Updated to camelCase
      .populate('destinationProvince', 'description') // Updated to camelCase
      .select('tourCode name images duration representativePrice averageRating totalSlotsBooked isBestseller') // Updated to camelCase
      .lean();

    const totalTours = await Tour.countDocuments(query);

    const formattedTours = tours.map(tour => ({
      ...tour,
      startingProvince: tour.startingProvince ? tour.startingProvince.description : null, // Updated to camelCase
      destinationProvince: tour.destinationProvince ? tour.destinationProvince.description : null // Updated to camelCase
    }));

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalTours / parseInt(limit)),
      totalTours,
      tours: formattedTours
    });
  } catch (error) {
    console.error("Error getting tours:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getTourDetails = async (req, res) => {
  try {
    const tourId = req.params.id;

    const tour = await Tour.findById(tourId)
                           .populate('startingProvince', 'description') // Updated to camelCase
                           .populate('destinationProvince', 'description') // Updated to camelCase
                           .lean();

    if (!tour || tour.deletedAt !== null) { // Updated to camelCase
      return res.status(404).json({ message: 'Tour not found' });
    }

    const departures = await Departure.find(
      {
        tourId: tourId, // Updated to camelCase
        departureDate: { $gte: new Date() }, // Updated to camelCase
        status: "open",
        deletedAt: null // Updated to camelCase
      }
    ).sort({ departureDate: 1 }).lean(); // Updated to camelCase

    const formattedTour = {
      ...tour,
      startingProvince: tour.startingProvince ? tour.startingProvince.description : null, // Updated to camelCase
      destinationProvince: tour.destinationProvince ? tour.destinationProvince.description : null // Updated to camelCase
    };

    res.status(200).json({ tour: formattedTour, departures });
  } catch (error) {
    console.error("Error getting tour details:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const addReviewToTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const userId = req.user.userId;
    const { rating, comment, images } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const hasCompletedBooking = await Booking.findOne({
        "user.userId": userId, // Updated to camelCase
        tourId: tourId, // Updated to camelCase
        status: "completed",
        deletedAt: null // Updated to camelCase
    });

    if (!hasCompletedBooking) {
        return res.status(403).json({ message: 'You can only review tours you have completed.' });
    }

    const newReview = new Review({
      tourId: tourId, // Updated to camelCase
      user: {
        userId: userId, // Updated to camelCase
        name: req.user.fullName, // Updated to camelCase
        avatarUrl: req.user.avatarUrl // Updated to camelCase
      },
      rating: parseFloat(rating),
      comment: comment || "",
      images: images || [],
    });

    const savedReview = await newReview.save();

    const aggregationResult = await Review.aggregate([
      { $match: { tourId: newReview.tourId, deletedAt: null } }, // Updated to camelCase
      {
        $group: {
          _id: "$tourId", // Updated to camelCase
          averageRating: { $avg: "$rating" } // Updated to camelCase
        }
      }
    ]);

    const newAverageRating = aggregationResult.length > 0 ? aggregationResult[0].averageRating : 0; // Updated to camelCase

    await Tour.updateOne(
      { _id: newReview.tourId }, // Updated to camelCase
      { $set: { averageRating: parseFloat(newAverageRating.toFixed(1)) } } // Updated to camelCase
    );

    res.status(201).json({ message: 'Review added successfully', reviewId: savedReview._id });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getTourReviews = async (req, res) => {
  try {
    const { id } = req.params; // Lấy tour ID từ URL params

    const tour = await Tour.findById(id).select('reviews'); 

    if (!tour || tour.deletedAt !== null) {
      return res.status(404).json({ message: 'Tour not found.' });
    }

    const reviews = tour.reviews.sort((a, b) => b.createdAt - a.createdAt); 

    res.status(200).json({
      tourId: id,
      reviewCount: reviews.length,
      reviews: reviews
    });

  } catch (error) {
    console.error("Error fetching tour reviews:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
module.exports = {
    createTour,
    getTours,
    getPopularTours,
    getToursUser,
    getTourDetails,
    addReviewToTour,
    getTourReviews
}


