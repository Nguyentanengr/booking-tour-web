const { body, query, param } = require('express-validator');

const validationMiddleware = require('../middleware/validationMiddleware');


const getToursValidator = [
    query('searchTerm')
        .optional()
        .isString()
        .trim()
        .escape()
        .withMessage('Search term must be a string.'),
    query('provinceFilter')
        .optional()
        .isString()
        .trim()
        .escape()
        .withMessage('Province filter must be a string (province ID).'),
    query('bestsellerFilter')
        .optional()
        .isBoolean()
        .withMessage('Bestseller filter must be a boolean (true/false).')
        .toBoolean(),
    query('activeFilter')
        .optional()
        .isIn(['all', 'active', 'inactive'])
        .withMessage('Active filter must be "all", "active", or "inactive".'),
    query('sortCriterion')
        .optional()
        .isIn(['tourCode', 'name', 'representativePrice.adult']) // Sử dụng tên trường trong schema MongoDB
        .withMessage('Sort criterion must be "tourCode", "name", or "representativePrice.adult".'),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be "asc" or "desc".'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be an integer greater than or equal to 1.')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }) // Giới hạn hợp lý cho số lượng tour mỗi trang
        .withMessage('Limit must be an integer between 1 and 100.')
        .toInt(),
    validationMiddleware
];


const toggleTourStatusValidator = [
    body('isActive')
        .isBoolean()
        .withMessage('isActive must be a boolean (true/false).'),
    validationMiddleware
];

const deleteTourValidator = [
    param('id').isMongoId().withMessage('Tour ID is not a valid Mongo ObjectId.'),
    body('deleteReason')
        .notEmpty().withMessage('Delete reason cannot be empty.')
        .isLength({ min: 5 }).withMessage('Delete reason must be at least 5 characters long.'),
    validationMiddleware
];

const addTourValidator = [
    body('name')
        .notEmpty().withMessage('Tên tour là bắt buộc.')
        .isLength({ min: 3, max: 200 }).withMessage('Tên tour phải có từ 3 đến 200 ký tự.'),
    body('tourCode')
        .notEmpty().withMessage('Mã tour là bắt buộc.')
        .isLength({ min: 3, max: 50 }).withMessage('Mã tour phải có từ 3 đến 50 ký tự.'),
    body('description')
        .optional()
        .notEmpty().withMessage('Mô tả là bắt buộc.')
        .isLength({ min: 10 }).withMessage('Mô tả phải có ít nhất 10 ký tự.'),
    body('images')
        .isArray({ min: 1 }).withMessage('Phải có ít nhất một hình ảnh.')
        .custom((images) => {
            if (!images.some(img => img.isMain)) {
                throw new Error('Phải chọn ít nhất một hình ảnh chính.');
            }
            return true;
        }),
    body('images.*.base64')
        .notEmpty().withMessage('Dữ liệu base64 của hình ảnh không được để trống.')
        .isString().withMessage('Dữ liệu base64 của hình ảnh phải là chuỗi.'),
    body('images.*.isMain')
        .isBoolean().withMessage('Trạng thái hình ảnh chính phải là boolean.'),
    body('services')
        .isArray().withMessage('Dịch vụ phải là một mảng.')
        .custom(value => {
            const allowedServices = ['Ăn uống', 'Vé tham quan', 'Hướng dẫn viên', 'Vé máy bay', 'Khách sạn', 'Xe đưa đón'];
            if (value.some(service => !allowedServices.includes(service))) {
                throw new Error('Dịch vụ không hợp lệ.');
            }
            return true;
        }),
    body('itinerary')
        .isArray({ min: 1 }).withMessage('Lịch trình phải có ít nhất một ngày.'),
    body('itinerary.*.day') // Dựa trên frontend, trường này là `day`
        .isInt({ min: 1 }).withMessage('Ngày trong lịch trình phải là số nguyên dương.'),
    body('itinerary.*.title')
        .notEmpty().withMessage('Tiêu đề lịch trình là bắt buộc.')
        .isLength({ min: 3 }).withMessage('Tiêu đề lịch trình phải có ít nhất 3 ký tự.'),
    body('itinerary.*.description')
        .notEmpty().withMessage('Mô tả lịch trình là bắt buộc.')
        .isLength({ min: 10 }).withMessage('Mô tả lịch trình phải có ít nhất 10 ký tự.'),
    body('policies')
        .isArray().withMessage('Chính sách phải là một mảng.'),
    body('policies.*.title')
        .notEmpty().withMessage('Tiêu đề chính sách là bắt buộc.')
        .isLength({ min: 3 }).withMessage('Tiêu đề chính sách phải có ít nhất 3 ký tự.'),
    body('policies.*.description')
        .notEmpty().withMessage('Mô tả chính sách là bắt buộc.')
        .isLength({ min: 10 }).withMessage('Mô tả chính sách phải có ít nhất 10 ký tự.'),
    body('duration')
        .notEmpty().withMessage('Thời gian tour là bắt buộc.')
        .isString().withMessage('Thời gian tour phải là chuỗi.'),
    body('destinationProvince')
        .notEmpty().withMessage('ID tỉnh điểm đến là bắt buộc.'),
    body('transportation')
        .optional()
        .isString().withMessage('Phương tiện phải là chuỗi.')
        .isIn(['Xe buýt', 'Máy bay', 'Tàu hỏa', 'Xe hơi', '']) // Thêm rỗng để khớp với option "Chọn phương tiện"
        .withMessage('Phương tiện không hợp lệ.'),
    body('additionalServices.*.price')
        .optional()
        .isFloat({ min: 0 }),
    body('representativePrice.adult')
        .notEmpty().withMessage('Giá người lớn là bắt buộc.')
        .isFloat({ min: 1 }).withMessage('Giá người lớn phải lớn hơn 0.'), // Thay đổi min: 0 thành min: 1
    body('representativePrice.discountedPrice')
        .optional({ nullable: true })
        .isFloat({ min: 0 }).withMessage('Giá khuyến mãi phải là số không âm.')
        .custom((value, { req }) => {
            if (value && value >= req.body.representativePrice.adult) {
                throw new Error('Giá khuyến mãi phải nhỏ hơn giá người lớn.');
            }
            return true;
        }),
    body('departureSummary')
        .isArray().withMessage('Thông tin ngày khởi hành phải là một mảng.'),
    body('departureSummary.*.departure_date') // Dựa trên frontend, trường này là `departure_date`
        .notEmpty().withMessage('Ngày khởi hành trong bản tóm tắt là bắt buộc.')
        .isISO8601().toDate().withMessage('Ngày khởi hành trong bản tóm tắt phải là định dạng ngày hợp lệ (YYYY-MM-DD).'),
    body('isBestseller')
        .isBoolean().withMessage('Trạng thái Bestseller phải là boolean.')
        .toBoolean(),
    validationMiddleware
];


module.exports = {
    getToursValidator,
    toggleTourStatusValidator,
    deleteTourValidator,
    addTourValidator,
};