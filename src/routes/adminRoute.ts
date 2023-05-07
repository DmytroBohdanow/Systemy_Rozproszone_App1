import { Router } from 'express';

export const adminRoute = Router();

adminRoute.get('/admin', (req, res) => {
  res.send("Admin page");
});