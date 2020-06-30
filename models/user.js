const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("./token");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    salt: String,
  },
  { timestamp: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods = {
  generatePasswordReset: function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
  },

  generateVerificationToken: function () {
    let payload = {
      userId: this._id,
      token: crypto.randomBytes(20).toString("hex"),
    };

    return new Token(payload);
  },
  comparePassword: function (password) {
    return bcrypt.compareSync(password, this.password);
  },

  generateJWT: function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
      id: this._id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
    });
  },
};

// userSchema
//   .virtual("password")
//   .set(function(password) {
//     // create a temporarity variable called _password
//     this._password = password;
//     // generate salt
//     this.salt = this.makeSalt();
//     // encryptPassword
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function() {
//     return this._password;
//   });

// userSchema.methods = {
//   authenticate: function(plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },

//   encryptPassword: function(password) {
//     if (!password) return "";
//     try {
//       return crypto
//         .createHmac("sha1", this.salt)
//         .update(password)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   },

//   makeSalt: function() {
//     return Math.round(new Date().valueOf() * Math.random()) + "";
//   }
// };

module.exports = mongoose.model("User", userSchema);
