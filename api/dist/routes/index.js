"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const admin_1 = __importDefault(require("./admin"));
const users_1 = __importDefault(require("./users"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
router.use('/admin', admin_1.default);
router.use('/users', users_1.default);
router.use('/auth/refreshToken', auth_controller_1.refreshAccessToken);
router.use('/auth/login', auth_controller_1.login);
router.use('/auth/logout', auth_middleware_1.protect, auth_controller_1.logout);
// // Constants for client credentials and redirect URI
// const CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || '';
// const CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || '';
// const REDIRECT_URI: string = 'http://localhost:3001/';
// // Initiates the Google Login flow
// router.get('/auth/google', (req: Request, res: Response) => {
//   const url: string = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
//   res.redirect(url);
// });
// // Callback URL for handling the Google Login response
// router.get('/auth/google/callback', async (req: Request, res: Response) => {
//   try {
//     // Exchange authorization code for access token
//     const { data } = await axios.post('https://oauth2.googleapis.com/token', {
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uri: REDIRECT_URI,
//       grant_type: 'authorization_code',
//     });
//     const { access_token, id_token } = data;
//     // Use access_token to fetch user profile
//     const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
//       headers: { Authorization: `Bearer ${access_token}` },
//     });
//     const profile = profileResponse.data;
//     // Code to handle user authentication and retrieval using the profile data
//     res.redirect('/');
//   } catch (error: any) {
//     console.error('Error:', error.response?.data.error);
//     res.redirect('/login');
//   }
// });
// // Logout route
// router.get('/logout', (req: Request, res: Response) => {
//   // Code to handle user logout
//   res.redirect('/login');
// });
exports.default = router;
