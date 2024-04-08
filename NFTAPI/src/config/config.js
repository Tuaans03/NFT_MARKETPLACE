const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
const { error } = require("console");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("produciton", "development", "test")
      .required(),
    BASE_URL: Joi.string().default("http://localhost:3000"),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),

    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minuates after which access tokens expire"),
    JWT_ACCESS_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("Days after which refesh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minuates after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default()
      .description("minutes after which verify email token expires"),

    SMTP_HOST: Joi.string().description("sever that will send email"),
    SMTP_PORT: Joi.number().description("port to connect to the email sever"),
    SMTP_USERNAME: Joi.string().description("username for email sever"),
    SMTP_PASSWORD: Joi.string().description("Password for email sever"),

    EMAIL_FROM: Joi.string().description(
      "the from field in the emails swnt the app"
    ),
    VERIFICATION_EMAIL_URL: Joi.string().description(
      "URL for verifying the users email"
    ),
    CLOUD_NAME: Joi.string().description(
      "Cloudinary cloud name for media storage"
    ),
    API_KEY: Joi.string().description(
      "API key for acessing the Cloudinary API"
    ),
    API_SECRET: Joi.string().description(
      "API secret for accessing the Cloudinary API"
    ),
  })
  .unknown();

const { value: envVars, err } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config  validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  base_url: envVars.BASE_URL,
  port: envVars.PORT,

  mongoose: {
    url: envVars.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refeshExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
      from: envVars.EMAIL_FROM,
      verificationEmailUrl: envVars.VERIFICATION_EMAIL_URL,
    },
  },
  cloudary: {
    cloud_name: envVars.CLOUD_NAME,
    api_key: envVarsSchema.API_KEY,
    api_secret: envVars.API_SECRET,
  },
  admin: {
    email: envVars.ADMIN_EMAIL,
    password: envVars.ADMIN_PASSWORD,
    fullname: envVars.ADMIN_FULLNAME,
  },
};
