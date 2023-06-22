import express from 'express';
import { usersApiRoute } from './usersApiRoute.js';
import { loginApiRoute } from './loginApiRoute.js';
import { adminsApiRoute } from './adminsApiRoute.js';
import { transferApiRoute } from './transferApiRoute.js';
import { topUpApiRoute } from './topUpApiRoute.js';
export const routes = express.Router();

routes.use(usersApiRoute);
routes.use(loginApiRoute);
routes.use(adminsApiRoute);
routes.use(transferApiRoute);
routes.use(topUpApiRoute);