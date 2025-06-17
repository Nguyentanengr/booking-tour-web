// booking-tour-web - Copy/server/tao_admin.js

const mongoose = require('mongoose');
const AdminsModel = require('./models/AdminsModel.js');
const connectDB = require('./configs/db');
require('dotenv').config();

const createAdmin = async () => {
    await connectDB();

    try {
        // ======================================================
        // <<< ĐÂY LÀ THÔNG TIN BẠN SẼ DÙNG ĐỂ ĐĂNG NHẬP >>>
        const adminEmail = 'admin2@gmail.com';
        const adminPassword = '123123123'; // <-- Đặt mật khẩu bạn muốn ở đây
        // ======================================================

        const existingAdmin = await AdminsModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`❌ Lỗi: Admin với email "${adminEmail}" đã tồn tại! Vui lòng xóa thủ công trong database hoặc đổi email khác.`);
            return;
        }

        // Tạo admin mới với mật khẩu dạng chữ
        const newAdmin = new AdminsModel({
            full_name: 'Admin dep trai',
            email: adminEmail,
            password: adminPassword, // Cung cấp mật khẩu dạng chữ
            phone_number: '0987654321',
            role: 'super_admin',
            status: 'active',
            gender: 'Male' // Đảm bảo các trường required khác cũng có
        });

        // Model sẽ tự động mã hóa mật khẩu trước khi thực hiện lệnh .save()
        await newAdmin.save();

        console.log('✅ Tạo tài khoản Admin thành công!');
        console.log(`   Sử dụng các thông tin sau để đăng nhập:`);
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Mật khẩu: ${adminPassword}`);

    } catch (error) {
        console.error('❌ Đã xảy ra lỗi khi tạo Admin:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Đã đóng kết nối database.');
    }
};

createAdmin();