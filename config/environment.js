const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
});

const development = {
  port: 8000,
  name: 'development',
  api_v: process.env.AUTH_API_V,
  base_url: process.env.AUTH_BASE_URL,
  front_base_url: process.env.FRONT_BASE_URL || 'http://localhost:3000',
  asset_path: './assets',
  session_cookie_key: 'some_secret_key',
  db: 'xspace_dev',
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ADDR,
      pass: process.env.MAIL_PASS,
    },
  },
  google_client_id:
    '665614270427-ovu837sfno1j16jbr2bf29n6tka4e2sm.apps.googleusercontent.com',
  google_client_secret: 'LZ_XpeAbgh3eoomr0PVtX-vH',
  google_callback_url: 'http://localhost:8000/user/auth/google/callback',
  jwt_secret: 'super-secret-key',
  morgan: {
    mode: 'dev',
    options: { stream: accessLogStream },
  },
};

const production = {
  port: 80,
  name: process.env.CODEIAL_ENVIRONMENT,
  api_v: process.env.AUTH_API_V,
  base_url: process.env.AUTH_BASE_URL,
  front_base_url: process.env.FRONT_BASE_URL,
  asset_path: process.env.CODEIAL_ASSET_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB,
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      pass: process.env.CODEIAL_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  morgan: {
    mode: 'combined',
    options: { stream: accessLogStream },
  },
};

// module.exports = development;
module.exports =
  eval(process.env.CODEIAL_ENVIRONMENT) == undefined
    ? development
    : eval(process.env.CODEIAL_ENVIRONMENT);
