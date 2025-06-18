const log4js = require('log4js');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require("../utils/response");

const Tour = require('../models/ToursModel');
const Province = require('../models/ProvincesModel'); // Import Province model
const Departure = require('../models/DeparturesModel');
const { uploadImageFromBase64 } = require('../utils/upload');


const logger = log4js.getLogger();

const getTourStats = async (req, res) => {
    try {
        const total = await Tour.countDocuments({ deletedAt: null });
        const activeTours = await Tour.countDocuments({ isActive: true, deletedAt: null });
        const inactiveTours = await Tour.countDocuments({ isActive: false, deletedAt: null });
        const bestsellerTours = await Tour.countDocuments({ isBestseller: true, deletedAt: null });

        logger.info('Tour statistics fetched successfully.');
        return successResponse(res, {
            total,
            activeTours,
            inactiveTours,
            bestsellerTours,
        }, 200);
    } catch (error) {
        logger.error(`Error fetching tour statistics: ${error.message}`, error);
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};

const getTours = async (req, res) => {
    try {
        const {
            searchTerm,
            provinceFilter,
            bestsellerFilter,
            activeFilter,
            sortCriterion,
            sortOrder = 'asc',
            page = 1,
            limit = 10
        } = req.query;

        // Bắt buộc chỉ lấy các tour chưa bị xóa mềm
        let query = { deletedAt: null };

        // Tìm kiếm theo tourCode hoặc name
        if (searchTerm) {
            query.$or = [
                { tourCode: { $regex: searchTerm, $options: 'i' } },
                { name: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Lọc theo tỉnh/thành
        if (provinceFilter && provinceFilter !== 'all') {
            query.destinationProvince = provinceFilter;
        }

        // Lọc theo bestseller
        if (bestsellerFilter) {
            // Chuyển đổi sang boolean rõ ràng hơn nếu bestsellerFilter là chuỗi
            query.isBestseller = bestsellerFilter === 'true' || bestsellerFilter === true;
        }

        // Lọc theo trạng thái hoạt động (isActive)
        // Lưu ý: filter này hoạt động độc lập với deletedAt = null
        if (activeFilter === 'active') {
            query.isActive = true;
        } else if (activeFilter === 'inactive') {
            query.isActive = false;
        }

        const sortOptions = {};
        if (sortCriterion) {
            const mongoSortCriterion = {
                'tourCode': 'tourCode',
                'name': 'name',
                'price': 'representativePrice.discountedPrice' // Ưu tiên discountedPrice nếu có
                // Nếu không có discountedPrice, Mongo sẽ sắp xếp theo giá trị null, sau đó đến các giá trị khác
                // Để sắp xếp theo discountedPrice HOẶC adultPrice, bạn cần dùng aggregation pipeline
            }[sortCriterion] || sortCriterion;

            sortOptions[mongoSortCriterion] = sortOrder === 'asc' ? 1 : -1;

            // Nếu sắp xếp theo giá và bạn muốn hành vi phức tạp hơn (ví dụ: discountedPrice ASC, sau đó adultPrice ASC)
            // thì cần thêm một điều kiện nữa nếu bạn dùng aggregate, nhưng với find().sort(), nó đơn giản hơn.
            if (sortCriterion === 'price') {
                sortOptions['representativePrice.adult'] = sortOrder === 'asc' ? 1 : -1; // Thêm điều kiện phụ
            }
        } else {
            // Sắp xếp mặc định theo ngày tạo giảm dần (tour mới nhất lên đầu)
            sortOptions.createdAt = -1;
        }

        const totalTours = await Tour.countDocuments(query);
        const tours = await Tour.find(query)
            // Giả định 'Province' có trường 'name' mà bạn muốn hiển thị thay vì 'description'
            // Dựa trên mockProvinces của bạn có `name`, tôi sẽ dùng `name` ở đây.
            .populate('startingProvince', 'name') // Populate tên tỉnh xuất phát
            .populate('destinationProvince', 'name') // Populate tên tỉnh điểm đến
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);

        const transformedTours = tours.map(tour => {
            const representativePrice = tour.representativePrice.discountedPrice !== undefined && tour.representativePrice.discountedPrice !== null
                ? { new_price: tour.representativePrice.discountedPrice, adult: tour.representativePrice.adult }
                : { adult: tour.representativePrice.adult };

            return {
                _id: tour._id,
                tour_code: tour.tourCode,
                name: tour.name,
                // Sử dụng tour.startingProvince.name thay vì _id cho display
                starting_province_id: tour.startingProvince ? tour.startingProvince._id : null,
                starting_province_name: tour.startingProvince ? tour.startingProvince.name : 'N/A',

                destination_province_id: tour.destinationProvince ? tour.destinationProvince._id : null,
                // Sử dụng tour.destinationProvince.name thay vì description
                destination_province_name: tour.destinationProvince ? tour.destinationProvince.name : 'N/A',

                duration: tour.duration,
                representative_price: representativePrice,
                is_bestseller: tour.isBestseller,
                is_active: tour.isActive,
                averageRating: tour.averageRating,
                // Thêm các trường khác để khớp với ViewTourModal nếu bạn dùng hàm này để đổ dữ liệu
                images: tour.images,
                description: tour.description,
                services: tour.services,
                itinerary: tour.itinerary,
                policies: tour.policies,
                transportation: tour.transportation,
                additionalServices: tour.additionalServices,
                departureSummary: tour.departureSummary,
                totalSlotsBooked: tour.totalSlotsBooked,
                createdBy: tour.createdBy,
                createdAt: tour.createdAt,
                updatedAt: tour.updatedAt,
                // Không trả về deletedAt để đảm bảo frontend không thấy các tour đã xóa
            };
        });

        logger.info(`Fetched ${transformedTours.length} tours on page ${page}. Total: ${totalTours}.`);
        return successResponse(res, {
            tours: transformedTours,
            totalItems: totalTours,
            totalPages: Math.ceil(totalTours / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit)
        }, 200);

    } catch (error) {
        logger.error(`Error fetching tours: ${error.message}`, error);
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};


const toggleTourStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body; // Giá trị true/false mong muốn

        const tour = await Tour.findById(id);

        if (!tour) {
            logger.warn(`Attempted to toggle status for non-existent tour ID: ${id}`);
            return errorResponse(res, {
                code: 'NOT_FOUND',
                message: 'Tour not found.'
            }, 404);
        }

        tour.isActive = isActive;
        tour.updatedAt = new Date(); // Cập nhật thời gian chỉnh sửa
        await tour.save();

        logger.info(`Tour ID ${id} active status toggled to ${isActive}.`);
        return successResponse(res, { message: `Tour status updated successfully to ${isActive ? 'active' : 'inactive'}.`, tourId: tour._id, newStatus: tour.isActive }, 200);

    } catch (error) {
        logger.error(`Error toggling tour status for ID ${req.params.id}: ${error.message}`, error);
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};


const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        const { deleteReason } = req.body; // Lý do xóa từ request body

        const tour = await Tour.findById(id);

        if (!tour) {
            logger.warn(`Attempted to delete non-existent tour ID: ${id}`);
            return errorResponse(res, {
                code: 'NOT_FOUND',
                message: 'Tour not found.'
            }, 404);
        }

        if (tour.totalSlotsBooked > 0) {
            // SOFT DELETE: Nếu tour có đặt chỗ, chỉ đánh dấu là đã xóa và không hoạt động
            tour.isActive = false;
            tour.deletedAt = new Date();
            // Bạn có thể thêm một trường `deleteReason` vào schema nếu muốn lưu lý do xóa mềm
            // tour.deleteReason = deleteReason; 

            await tour.save();
            logger.info(`Tour ID ${id} (code: ${tour.tourCode}) with bookings has been soft-deleted (deactivated). Reason: ${deleteReason}`);
            return successResponse(res, {
                message: `Tour "${tour.name}" (Mã: ${tour.tourCode}) đã được xóa mềm thành công (vô hiệu hóa).`,
                tourId: tour._id,
                newIsActiveStatus: tour.isActive,
                deletedAt: tour.deletedAt
            }, 200);

        } else {
            // HARD DELETE: Nếu không có đặt chỗ, xóa hẳn tour khỏi database
            await Tour.deleteOne({ _id: id });
            logger.info(`Tour ID ${id} (code: ${tour.tourCode}) without bookings has been permanently deleted. Reason: ${deleteReason}`);
            return successResponse(res, {
                message: `Tour "${tour.name}" (Mã: ${tour.tourCode}) đã được xóa vĩnh viễn thành công.`,
                tourId: id
            }, 200);
        }

    } catch (error) {
        logger.error(`Error deleting tour for ID ${req.params.id}: ${error.message}`, error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return errorResponse(res, {
                code: 'VALIDATION_ERROR',
                message: errors.join(', ')
            }, 400);
        }
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};


const getTourDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm tour bằng ID, chỉ đảm bảo tour chưa bị xóa mềm
        const tour = await Tour.findById(id)
            .where('deletedAt').equals(null) // CHỈ kiểm tra deletedAt là null
            .lean();

        if (!tour) {
            logger.warn(`Attempted to retrieve details for non-existent or soft-deleted tour ID: ${id}`);
            return errorResponse(res, {
                code: 'NOT_FOUND',
                message: 'Tour not found or has been deleted.'
            }, 404);
        }

        logger.info(`Successfully retrieved details for tour ID: ${id}.`);
        return successResponse(res, { tour }, 200);

    } catch (error) {
        logger.error(`Error retrieving tour details for ID ${req.params.id}: ${error.message}`, error);
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};

const addTour = async (req, res) => {
    try {
        const {
            name,
            tourCode,
            description,
            images,
            services,
            itinerary,
            policies, // Cần xử lý policies để khớp schema
            duration,
            startingProvince: startingProvinceDescription,
            destinationProvince: destinationProvinceDescription,
            transportation,
            representativePrice,
            departureSummary,
            isBestseller,
        } = req.body;

        // Kiểm tra xem startingProvince và destinationProvince có tồn tại trong DB không
        let foundStartingProvince = null;
        if (startingProvinceDescription) {
            foundStartingProvince = await Province.findOne({ _id: startingProvinceDescription });
            if (!foundStartingProvince) {
                return errorResponse(res, {
                    code: 'INVALID_INPUT',
                    message: `Tỉnh xuất phát "${startingProvinceDescription}" không tồn tại.`
                }, 400);
            }
        }

        const foundDestinationProvince = await Province.findOne({ _id: destinationProvinceDescription });
        if (!foundDestinationProvince) {
            return errorResponse(res, {
                code: 'INVALID_INPUT',
                message: `Tỉnh điểm đến "${destinationProvinceDescription}" không tồn tại.`
            }, 400);
        }

        // Xử lý upload hình ảnh
        const uploadedImageUrls = [];
        if (images && images.length > 0) {
            const mainImage = images.find(img => img.isMain);
            const otherImages = images.filter(img => !img.isMain);

            if (mainImage && mainImage.base64) {
                try {
                    const mainImageUrl = await uploadImageFromBase64(mainImage.base64, 'tour-images');
                    uploadedImageUrls.push(mainImageUrl);
                } catch (uploadError) {
                    logger.error(`Failed to upload main image for tour ${tourCode}: ${uploadError.message}`);
                    return errorResponse(res, {
                        code: 'UPLOAD_ERROR',
                        message: `Lỗi khi tải lên hình ảnh chính: ${uploadError.message}`
                    }, 500);
                }
            }

            const otherImageUploadPromises = otherImages.map(async (img) => {
                if (img.base64) {
                    try {
                        return await uploadImageFromBase64(img.base64, 'tour-images');
                    } catch (err) {
                        logger.warn(`Failed to upload secondary image for tour ${tourCode}: ${err.message}`);
                        return null;
                    }
                }
                return null;
            });
            const uploadedOtherImageUrls = (await Promise.all(otherImageUploadPromises)).filter(url => url !== null);
            uploadedImageUrls.push(...uploadedOtherImageUrls);

            if (uploadedImageUrls.length === 0 && images.length > 0) {
                return errorResponse(res, {
                    code: 'IMAGE_UPLOAD_ERROR',
                    message: 'Không có hình ảnh nào được tải lên thành công. Vui lòng kiểm tra lại định dạng ảnh.'
                }, 400);
            }
        } else {
            // Optional: Trả lỗi nếu không có ảnh nào được cung cấp và schema yêu cầu ảnh
            // if (imagesAreRequiredInSchema) {
            //     return errorResponse(res, {
            //         code: 'INVALID_INPUT',
            //         message: 'Ít nhất một hình ảnh là bắt buộc.'
            //     }, 400);
            // }
        }


        // Xử lý Policies để khớp với schema
        // Schema của bạn có `policies: { transportation, cancellation, booking, refund }`
        // Trong khi JSON body của bạn là `policies: [{ title, description }]`
        // Bạn cần ánh xạ lại hoặc điều chỉnh schema/body. Tôi sẽ ánh xạ tạm dựa trên title.
        const transformedPolicies = {};
        if (policies && Array.isArray(policies)) {
            policies.forEach(policy => {
                if (policy.title && policy.description) {
                    const normalizedTitle = policy.title.toLowerCase();
                    if (normalizedTitle.includes('hủy tour')) {
                        transformedPolicies.cancellation = policy.description;
                    } else if (normalizedTitle.includes('thanh toán')) {
                        transformedPolicies.booking = policy.description; // Có thể map vào booking hoặc tạo trường riêng
                    } else if (normalizedTitle.includes('trẻ em')) {
                        // Schema của bạn không có trường cho "trẻ em" trong policies, cân nhắc thêm vào
                    }
                    // Thêm các điều kiện khác nếu có các loại policy khác
                }
            });
        }
        // Nếu bạn muốn lưu toàn bộ mảng policies như JSON ban đầu, bạn cần thay đổi schema Tour.policies thành Array.
        // Ví dụ: `policies: [{ title: String, description: String }]`

        // Tạo đối tượng Tour mới
        const newTour = new Tour({
            name: name, // OK, khớp với schema
            tourCode: tourCode, // OK, khớp với schema
            description: description,
            images: uploadedImageUrls, // OK, khớp với schema
            services: services,
            itinerary: itinerary.map(item => ({ // Ánh xạ itinerary, giả định `order` là `day`
                order: item.day, // Chuyển `day` sang `order`
                title: item.title,
                description: item.description
            })),
            policies: transformedPolicies, // Sử dụng transformedPolicies
            duration: duration, // OK, khớp với schema
            startingProvince: startingProvinceDescription, // _id là tên tỉnh
            destinationProvince: destinationProvinceDescription, // _id là tên tỉnh
            transportation: transportation,
            representativePrice: {
                adult: representativePrice.adult,
                discountedPrice: representativePrice.new_price // Đảm bảo discountedPrice có thể là undefined nếu new_price không có
            },
            departureSummary: [], // Sẽ cập nhật sau khi tạo Departures
            isBestseller: isBestseller,
            isActive: true, // Mặc định là true
            createdBy: {
                adminId: new mongoose.Types.ObjectId("663abcde1234567890abcd02"), // Lấy từ thông tin admin đã được xác thực (từ middleware)
                name: "admin" // Hoặc req.user.username/email tùy vào bạn lưu gì trong token
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        });

        // 3. Lưu tour để có tour._id
        await newTour.save();
        logger.info(`New tour "${newTour.name}" (ID: ${newTour._id}) created successfully.`);

        // 4. Tạo các Departure liên quan và cập nhật departureSummary của tour
        const tourDepartureSummary = []; // Khai báo một mảng để lưu thông tin tóm tắt khởi hành
        if (departureSummary && departureSummary.length > 0) {
            for (const dep of departureSummary) {
                let calculatedDuration = duration;
                if (!calculatedDuration) {
                    logger.warn(`Duration is missing for tour ${newTour._id}. Defaulting to 1 day for departure calculation.`);
                    calculatedDuration = "1N";
                }

                const daysMatch = calculatedDuration.match(/(\d+)N/);
                const nightsMatch = calculatedDuration.match(/(\d+)Đ/);

                let numberOfDays = 0;
                if (daysMatch) {
                    numberOfDays = parseInt(daysMatch[1]);
                } else if (nightsMatch) {
                    numberOfDays = parseInt(nightsMatch[1]) + 1;
                } else {
                    numberOfDays = 1;
                }

                const departureDateObj = new Date(dep.departure_date);
                const returnDateObj = new Date(departureDateObj);
                returnDateObj.setDate(returnDateObj.getDate() + numberOfDays);

                const newDeparture = new Departure({
                    tourId: newTour._id,
                    expirationDate: departureDateObj,
                    departureDate: departureDateObj,
                    returnDate: returnDateObj,
                    prices: {
                        adult: newTour.representativePrice.adult, // Lấy giá từ newTour.representativePrice.adult
                        discountedPrice: newTour.representativePrice.discountedPrice // Lấy giá giảm nếu có
                    },
                    availableSlots: 99, // Mặc định
                    status: 'available', // Mặc định
                    createdBy: {
                        adminId: new mongoose.Types.ObjectId("663abcde1234567890abcd02"),
                        name: "admin"
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null
                });
                await newDeparture.save();
                tourDepartureSummary.push({ // Thêm vào mảng tạm thời
                    departureId: newDeparture._id,
                    departureDate: newDeparture.departureDate
                });
            }
            // Gán mảng tạm thời vào newTour.departureSummary và lưu lại tour
            newTour.departureSummary = tourDepartureSummary;
            await newTour.save(); // Lưu lại tour để cập nhật departureSummary
            logger.info(`Created ${tourDepartureSummary.length} departures and updated tour departureSummary for tour ID: ${newTour._id}.`);
        }

        // Chuẩn bị dữ liệu trả về cho frontend
        const responseTour = {
            _id: newTour._id,
            tour_code: newTour.tourCode,
            name: newTour.name,
            images: newTour.images, // Sẽ có giá trị nếu đã lưu vào DB
            description: newTour.description,
            services: newTour.services,
            itinerary: newTour.itinerary.map(item => ({ // Trả về `day` thay vì `order`
                day: item.order,
                title: item.title,
                description: item.title
            })),
            policies: policies, // Trả về policies như đã nhận từ body để frontend tự xử lý nếu cần
            duration: newTour.duration,
            starting_province_id: newTour.startingProvince,
            starting_province_name: foundStartingProvince ? foundStartingProvince.name : 'N/A', // Sử dụng `name` của Province
            destination_province_id: newTour.destinationProvince,
            destination_province_name: foundDestinationProvince ? foundDestinationProvince.name : 'N/A', // Sử dụng `name` của Province
            transportation: newTour.transportation,
            representative_price: {
                adult: newTour.representativePrice.adult,
                new_price: newTour.representativePrice.discountedPrice // Có thể là undefined
            },
            departure_summary: newTour.departureSummary.map(dep => ({
                departure_id: dep.departureId,
                departure_date: dep.departureDate.toISOString().split('T')[0]
            })),
            is_bestseller: newTour.isBestseller,
            is_active: newTour.isActive,
            averageRating: newTour.averageRating,
            totalSlotsBooked: newTour.totalSlotsBooked,
            createdBy: newTour.createdBy,
            createdAt: newTour.createdAt,
            updatedAt: newTour.updatedAt,
        };

        return successResponse(res, {
            message: 'Tour đã được tạo thành công!',
            tour: responseTour
        }, 201);

    } catch (error) {
        logger.error(`Error adding new tour: ${error.message}`, error);
        // Kiểm tra lỗi validation chi tiết từ Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return errorResponse(res, {
                code: 'VALIDATION_ERROR',
                message: 'Lỗi xác thực dữ liệu: ' + errors.join(', ')
            }, 400);
        }
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Lỗi máy chủ khi thêm tour: ' + error.message
        }, 500);
    }
};


module.exports = {
    getTourStats,
    getTours,
    toggleTourStatus,
    deleteTour,
    getTourDetails,
    addTour
}