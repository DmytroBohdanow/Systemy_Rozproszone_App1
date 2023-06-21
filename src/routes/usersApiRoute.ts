import { Router, Request, Response } from "express";
import { findUserByUsername } from "../../utils/getUser.js";
export const usersApiRoute = Router();

usersApiRoute.post("/api/users", (req: Request, res: Response) => {
  const user = findUserByUsername(req.body.username);
  console.log(user)
  if (user.length > 0) {
    res.status(200).json({ user: user[0] });
  }
});

usersApiRoute.get("/api/users", (req: Request, res: Response) => {
  const user = findUserByUsername(req.body.username);
  console.log(user)
  if (user.length > 0) {
    res.status(200).json({ user: user[0] });
  }
});
