const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { toJSON, paginate } = require("./plugins");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email address is not valid");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 8) {
          throw new Error("Password must contain at least 8 characters");
        }
        if (!value.match(/\d/) || value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one better and one number"
          );
        }
      },
      private: true,
    },
    username: {
      type: String,
      trim: true,
    },
    profile_image: {
      type: String,
      default:
        "https://res.cloudinary.com/dzlxu2dlv/image/upload/v1699383593/medical-booking/image/sp1cmswjqpwuszoo3bzw.jpg",
    },
    profile_banner: {
      type: String,
      default:
        "https://res.cloudinary.com/dzlxu2dlv/image/upload/v1699383593/medical-booking/image/sp1cmswjqpwuszoo3bzw.jpg",
    },
    profile_bio: {
      type: String,
      trim: true,
    },
    profile_link: {
      website: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
    },
    wallet: {
      type: String,
      trim: true,
    },
    roles: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Role",
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    numberLogined: {
      type: Number,
      default: 0,
    },
    dateLastLogined: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);


userSchema.statics.isEmailTaken = async function(email,excludeUserId){
    const user = await this.findOne({email,_id:{$ne:excludeUserId}});
    return !!user;
}

userSchema.statics.isEmail  = function(email){
    return validator.isEmail(email);
}

userSchema.methods.isPasswordMath = async function (password) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,7);
    }
    next();
}

const User  = mongoose.model('User',userSchema);
module.exports = User;