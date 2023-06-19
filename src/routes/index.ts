import express from 'express';
import { userRoute } from './userRoute.js';
import { loginApiRoute } from './loginApiRoute.js';
import { adminRoute } from './adminRoute.js';
import { transferApiRoute } from './transferApiRoute.js';
export const routes = express.Router();

routes.use(userRoute);
routes.use(loginApiRoute);
routes.use(adminRoute);
routes.use(transferApiRoute);