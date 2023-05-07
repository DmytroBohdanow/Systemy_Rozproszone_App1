import express from 'express';
import { userRoute } from './userRoute.js';
import { loginRoute } from './loginRoute.js';
import { adminRoute } from './adminRoute.js';

export const routes = express.Router();

routes.use(userRoute);
routes.use(loginRoute);
routes.use(adminRoute);