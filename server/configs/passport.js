const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const Admin = require('../models/Admin'); // Thêm model Admin

/**
 * ======================================================================================
 * CẤU HÌNH STRATEGY CHO USER - Chỉ dành cho đăng nhập/đăng ký của USER qua Mạng Xã Hội
 * Admin KHÔNG sử dụng luồng này.
 * ======================================================================================
 */

// --- Google Strategy cho User ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Tìm user bằng googleId
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // 2. Nếu không có, tìm bằng email để liên kết tài khoản
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        user.avatar_url = user.avatar_url || profile.photos[0].value; // Cập nhật avatar nếu chưa có
        await user.save();
        return done(null, user);
      }
      
      // 3. Nếu không có user nào, tạo mới
      const newUser = new User({
          googleId: profile.id,
          full_name: profile.displayName,
          email: profile.emails[0].value,
          avatar_url: profile.photos[0].value,
          password: 'social_login_placeholder' // Mật khẩu tạm, không dùng để đăng nhập
      });

      // Bỏ qua yêu cầu mật khẩu khi lưu user từ social
      await newUser.save({ validateBeforeSave: false }); 
      return done(null, newUser);

    } catch (err) {
      return done(err, false);
    }
  }
));

// --- Facebook Strategy cho User ---
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Tìm user bằng facebookId
      let user = await User.findOne({ facebookId: profile.id });

      if (user) {
        return done(null, user);
      }

      // 2. Tìm bằng email để liên kết
      if (profile.emails && profile.emails[0] && profile.emails[0].value) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.facebookId = profile.id;
          user.avatar_url = user.avatar_url || profile.photos[0].value;
          await user.save();
          return done(null, user);
        }
      }

      // 3. Tạo user mới
      const newUser = new User({
        facebookId: profile.id,
        full_name: profile.displayName,
        // Một số tài khoản FB không trả về email, cần xử lý trường hợp này
        email: (profile.emails && profile.emails[0]) ? profile.emails[0].value : `${profile.id}@facebook-placeholder.com`,
        avatar_url: (profile.photos && profile.photos[0]) ? profile.photos[0].value : null,
        password: 'social_login_placeholder'
      });
      
      await newUser.save({ validateBeforeSave: false });
      return done(null, newUser);
    } catch (err) {
      return done(err, false);
    }
  }
));


/**
 * ======================================================================================
 * SERIALIZE & DESERIALIZE - Xử lý cho cả ADMIN và USER
 * Cần thiết để passport quản lý session đúng cách khi có nhiều loại tài khoản.
 * Nó sẽ lưu role vào session để biết cần tìm trong collection nào khi giải mã.
 * ======================================================================================
 */

// Lưu thông tin vào session
passport.serializeUser((account, done) => {
    // account có thể là admin hoặc user
    // Lưu một object chứa cả id và role
    done(null, { id: account.id, role: account.role });
});

// Lấy thông tin từ session ra
passport.deserializeUser(async (sessionData, done) => {
    try {
        if (sessionData.role === 'admin') {
            const admin = await Admin.findById(sessionData.id);
            done(null, admin);
        } else if (sessionData.role === 'user') {
            const user = await User.findById(sessionData.id);
            done(null, user);
        } else {
            done(new Error('Role không xác định trong session'), null);
        }
    } catch (err) {
        done(err, null);
    }
})