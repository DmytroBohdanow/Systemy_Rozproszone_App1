import express from 'express';
import { usersApiRoute } from './usersApiRoute.js';
import { loginApiRoute } from './loginApiRoute.js';
import { adminRoute } from './adminRoute.js';
import { transferApiRoute } from './transferApiRoute.js';
export const routes = express.Router();

routes.use(usersApiRoute);
routes.use(loginApiRoute);
routes.use(adminRoute);
routes.use(transferApiRoute);