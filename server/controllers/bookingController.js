// Thay đổi dòng import Moment.js sang Day.js
const Booking = require('../models/BookingsModel');
const Tour = require('../models/ToursModel');
const Departure = require('../models/DeparturesModel');
const Cancellation = require('../models/CancellationsModel');
const RefundPolicy = require('../models/RefundPoliciesModel');
const Payment = require('../models/PaymentsModel');
const User = require('../models/UsersModel');
const Notification = require('../models/NotificationsModel');
const dayjs = require('dayjs'); // Thay thế moment bằng dayjs

const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userName = req.user.fullName;
    const userAvatar = req.user.avatarUrl;

    const { tourId, departureId, passengers, additionalServices } = req.body;

    if (!tourId || !departureId || !passengers || passengers.length === 0) {
      return res.status(400).json({ message: 'Missing required booking information: tourId, departureId, or passengers.' });
    }

    const tour = await Tour.findById(tourId);
    const departure = await Departure.findById(departureId);

    if (!tour || tour.deletedAt !== null || !departure || departure.deletedAt !== null || departure.tourId.toString() !== tourId) {
      return res.status(404).json({ message: 'Tour or Departure not found or mismatch.' });
    }

    if (departure.availableSlots < passengers.length) {
      return res.status(400).json({ message: `Not enough available slots. Only ${departure.availableSlots} slots left.` });
    }

    let totalBookingPrice = 0;
    const processedPassengers = passengers.map(p => {
      let price = 0;
      switch (p.type) {
        case 'adult': price = departure.prices.adult; break;
        case 'child': price = departure.prices.child; break;
        case 'senior': price = departure.prices.senior; break;
        default: price = 0;
      }
      totalBookingPrice += price;
      return {
        fullName: p.fullName,
        dateOfBirth: new Date(p.dateOfBirth),
        gender: p.gender,
        phoneNumber: p.phoneNumber,
        type: p.type,
        price: price
      };
    });

    const bookedAdditionalServices = [];
    if (additionalServices && additionalServices.length > 0) {
      for (const reqService of additionalServices) {
        const foundService = tour.additionalServices.find(s => s.serviceId === reqService.serviceId);
        if (foundService && reqService.quantity > 0) {
          bookedAdditionalServices.push({
            serviceId: foundService.serviceId,
            name: foundService.name,
            price: foundService.price,
            quantity: reqService.quantity
          });
          totalBookingPrice += foundService.price * reqService.quantity;
        }
      }
    }

    const newBooking = new Booking({
      user: {
        userId: userId,
        avatarUrl: userAvatar,
        name: userName
      },
      tourId: tourId,
      departureId: departureId,
      passengers: processedPassengers,
      additionalServices: bookedAdditionalServices,
      totalPrice: totalBookingPrice,
      status: "confirmed",
    });

    const savedBooking = await newBooking.save();

    await Departure.updateOne(
      { _id: departureId },
      { $inc: { availableSlots: -passengers.length } }
    );

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          tourHistory: {
            tourId: tourId,
            departureId: departureId,
            bookingId: savedBooking._id,
            status: "confirmed"
          }
        }
      }
    );

    await Notification.create({
      recipientType: "user",
      recipientId: userId,
      type: "confirmation",
      title: "Xác nhận đặt tour thành công",
      message: `Cảm ơn quý khách đã đặt tour "${tour.name}"! Tổng tiền: ${totalBookingPrice.toLocaleString('vi-VN')} VNĐ. Mã đặt chỗ: ${savedBooking._id}`,
      status: "unread",
    });

    res.status(201).json({
      message: 'Booking created successfully!',
      bookingId: savedBooking._id,
      totalPrice: totalBookingPrice
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
   try {
    const bookingId = req.params.id;
    const userId = req.user.userId;
    const { cancellationReason } = req.body;

    if (!cancellationReason) {
      return res.status(400).json({ message: 'Cancellation reason is required' });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      "user.userId": userId,
      deletedAt: null
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    if (booking.status === 'completed') {
        return res.status(400).json({ message: 'Cannot cancel a completed tour.' });
    }

    const departure = await Departure.findById(booking.departureId);

    if (!departure || departure.deletedAt !== null) {
      return res.status(404).json({ message: 'Associated departure not found.' });
    }

    // Thay đổi từ moment() sang dayjs()
    const today = dayjs();
    const departureDate = dayjs(departure.departureDate);
    const daysBeforeDeparture = departureDate.diff(today, 'days'); // Day.js cũng có hàm diff()

    let refundPercentage = 0;
    const refundPolicy = await RefundPolicy.findOne(
      { daysBeforeDeparture: { $lte: daysBeforeDeparture }, deletedAt: null }
    ).sort({ daysBeforeDeparture: -1 });

    if (refundPolicy) {
      refundPercentage = refundPolicy.refundPercentage;
    }

    const refundAmount = booking.totalPrice * (refundPercentage / 100);

    const tour = await Tour.findById(booking.tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Associated tour not found for cancellation.' });
    }

    const cancellation = new Cancellation({
      bookingId: booking._id,
      user: {
        userId: userId,
        name: req.user.fullName
      },
      tourId: booking.tourId,
      tourCode: tour.tourCode,
      cancellationReason: cancellationReason,
      refundAmount: refundAmount,
      status: "pending",
    });
    const savedCancellation = await cancellation.save();

    await Booking.updateOne(
      { _id: bookingId },
      { $set: { status: "cancelled" } }
    );

    await Departure.updateOne(
      { _id: booking.departureId },
      { $inc: { availableSlots: booking.passengers.length } }
    );

    await User.updateOne(
        { "_id": userId, "tourHistory.bookingId": bookingId },
        { "$set": { "tourHistory.$.status": "cancelled" } }
    );

    await Notification.create({
        recipientType: "user",
        recipientId: userId,
        type: "cancellation",
        title: "Yêu cầu hủy tour đã được gửi",
        message: `Yêu cầu hủy tour #${bookingId} đã được gửi. Số tiền hoàn dự kiến: ${refundAmount.toLocaleString('vi-VN')} VNĐ.`,
        status: "unread",
    });

    res.status(200).json({
      message: 'Booking cancellation request submitted successfully.',
      cancellation: {
        _id: savedCancellation._id,
        refundAmount: refundAmount,
        status: "pending"
      }
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const processPayment = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;
    const { paymentMethod } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      "user.userId": userId,
      deletedAt: null
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized.' });
    }

    if (booking.status === 'paid' || booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: `Booking status is ${booking.status}. Cannot proceed with payment.` });
    }

    const paymentStatus = "success";
    const transactionId = "mock_txn_" + Date.now();
    const paymentMessage = "Payment processed successfully!";

    const newPayment = new Payment({
      bookingId: bookingId,
      cancellationId: null,
      type: "payment",
      amount: booking.totalPrice,
      paymentMethod: paymentMethod,
      transactionId: transactionId,
      status: paymentStatus,
    });
    await newPayment.save();

    await Booking.updateOne(
      { _id: bookingId },
      { $set: { status: "paid" } }
    );

    await User.updateOne(
        { "_id": userId, "tourHistory.bookingId": bookingId },
        { "$set": { "tourHistory.$.status": "paid" } }
    );

    await Notification.create({
      recipientType: "user",
      recipientId: userId,
      type: "payment_confirmation",
      title: "Thanh toán thành công!",
      message: `Đơn hàng #${bookingId} của bạn đã được thanh toán thành công với số tiền ${booking.totalPrice.toLocaleString('vi-VN')} VNĐ.`,
      status: "unread",
    });

    res.status(200).json({ message: paymentMessage, status: paymentStatus, transactionId });

  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  processPayment
};