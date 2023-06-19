import { Router, Request, Response } from "express";
import { findUserByUsername, findAdminByUsername } from "../../utils/getUser.js";

export const loginApiRoute = Router();

loginApiRoute.get("/api/login", (req: Request, res: Response) => {
  res.send("api login page");
});

loginApiRoute.post("/api/login", (req: Request, res: Response) => {
    if(req.body.isAdmin === "true") {
        res.status(200).json(findAdminByUsername(req.body.username));
    } else {
        res.status(200).json(findUserByUsername(req.body.username));
    }
});
