const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const usersModel = require('./models/UsersModel');
const adminsModel = require('./models/AdminsModel'); // Thêm model adminsModel

/**
 * ======================================================================================
 * CẤU HÌNH STRATEGY CHO usersModel - Chỉ dành cho đăng nhập/đăng ký của usersModel qua Mạng Xã Hội
 * adminsModel KHÔNG sử dụng luồng này.
 * ======================================================================================
 */

// --- Google Strategy cho usersModel ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Tìm usersModel bằng googleId
      let usersModel = await usersModel.findOne({ googleId: profile.id });

      if (usersModel) {
        return done(null, usersModel);
      }

      // 2. Nếu không có, tìm bằng email để liên kết tài khoản
      usersModel = await usersModel.findOne({ email: profile.emails[0].value });
      if (usersModel) {
        usersModel.googleId = profile.id;
        usersModel.avatar_url = usersModel.avatar_url || profile.photos[0].value; // Cập nhật avatar nếu chưa có
        await usersModel.save();
        return done(null, usersModel);
      }
      
      // 3. Nếu không có usersModel nào, tạo mới
      const newusersModel = new usersModel({
          googleId: profile.id,
          full_name: profile.displayName,
          email: profile.emails[0].value,
          avatar_url: profile.photos[0].value,
          password: 'social_login_placeholder' // Mật khẩu tạm, không dùng để đăng nhập
      });

      // Bỏ qua yêu cầu mật khẩu khi lưu usersModel từ social
      await newusersModel.save({ validateBeforeSave: false }); 
      return done(null, newusersModel);

    } catch (err) {
      return done(err, false);
    }
  }
));

// --- Facebook Strategy cho usersModel ---
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/v1/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Tìm usersModel bằng facebookId
      let usersModel = await usersModel.findOne({ facebookId: profile.id });

      if (usersModel) {
        return done(null, usersModel);
      }

      // 2. Tìm bằng email để liên kết
      if (profile.emails && profile.emails[0] && profile.emails[0].value) {
        usersModel = await usersModel.findOne({ email: profile.emails[0].value });
        if (usersModel) {
          usersModel.facebookId = profile.id;
          usersModel.avatar_url = usersModel.avatar_url || profile.photos[0].value;
          await usersModel.save();
          return done(null, usersModel);
        }
      }

      // 3. Tạo usersModel mới
      const newusersModel = new usersModel({
        facebookId: profile.id,
        full_name: profile.displayName,
        // Một số tài khoản FB không trả về email, cần xử lý trường hợp này
        email: (profile.emails && profile.emails[0]) ? profile.emails[0].value : `${profile.id}@facebook-placeholder.com`,
        avatar_url: (profile.photos && profile.photos[0]) ? profile.photos[0].value : null,
        password: 'social_login_placeholder'
      });
      
      await newusersModel.save({ validateBeforeSave: false });
      return done(null, newusersModel);
    } catch (err) {
      return done(err, false);
    }
  }
));


/**
 * ======================================================================================
 * SERIALIZE & DESERIALIZE - Xử lý cho cả adminsModel và usersModel
 * Cần thiết để passport quản lý session đúng cách khi có nhiều loại tài khoản.
 * Nó sẽ lưu role vào session để biết cần tìm trong collection nào khi giải mã.
 * ======================================================================================
 */

// Lưu thông tin vào session
passport.serializeusersModel((account, done) => {
    // account có thể là adminsModel hoặc usersModel
    // Lưu một object chứa cả id và role
    done(null, { id: account.id, role: account.role });
});

// Lấy thông tin từ session ra
passport.deserializeusersModel(async (sessionData, done) => {
    try {
        if (sessionData.role === 'adminsModel') {
            const adminsModel = await adminsModel.findById(sessionData.id);
            done(null, adminsModel);
        } else if (sessionData.role === 'usersModel') {
            const usersModel = await usersModel.findById(sessionData.id);
            done(null, usersModel);
        } else {
            done(new Error('Role không xác định trong session'), null);
        }
    } catch (err) {
        done(err, null);
    }
})