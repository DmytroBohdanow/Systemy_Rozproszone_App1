import { Router } from 'express';

export const loginRoute = Router();

loginRoute.get('/login', (req, res) => {
  res.send("Login page");
});