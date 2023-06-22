import { Router, Request, Response } from "express";
import { getAllAdmins } from "../../utils/getUser.js";
import { findAdminByUsername } from "../../utils/getUser.js";
import { addAdmin } from "../../utils/addAdmin.js";
export const adminsApiRoute = Router();

adminsApiRoute.get("/api/admins/all", (req: Request, res: Response) => {
  const admins = getAllAdmins();

    res.status(200).json({ admins: admins });
});

adminsApiRoute.post("/api/admins", (req: Request, res: Response) => {
  const admin = findAdminByUsername(req.body.username);

  if (admin.length > 0) {
    res.status(200).json({ admin: admin[0] });
  }
});

adminsApiRoute.post("/api/newadmin", (req: Request, res: Response) => {
  const admin = findAdminByUsername(req.body.username);

  if (admin.length > 0) {
    res.json({ error: `Error! Admin with username ${admin[0].username} already exists` });
  } else {
    addAdmin(req.body);
    res.status(200).json({ message: `Admin with username ${req.body.username} was added` });
  }
});