import { Router, Request, Response } from "express";
import { findUserByUsername, getAllUsers } from "../../utils/getUser.js";
import { addUser } from "../../utils/addUser.js";
import { modifyUserFields } from "../../utils/modifyUserFields.js";
import { deleteUserByUsername } from "../../utils/deleteUser.js";
export const usersApiRoute = Router();

usersApiRoute.post("/api/users", (req: Request, res: Response) => {
  const user = findUserByUsername(req.body.username);

  if (user.length > 0) {
    res.status(200).json({ user: user[0] });
  }
});

usersApiRoute.get("/api/users/all", (req: Request, res: Response) => {
  const users = getAllUsers();

    res.status(200).json({ users: users });
});

usersApiRoute.post("/api/newuser", (req: Request, res: Response) => {
  const user = findUserByUsername(req.body.username);

  if (user.length > 0) {
    res.json({ error: `Error! User with username ${user[0].username} already exists` });
  } else {
    addUser(req.body);
    res.status(200).json({ message: `User with username ${req.body.username} was added` });
  }
});

usersApiRoute.post("/api/user/edit", (req: Request, res: Response) => {
  modifyUserFields(req.body.username, req.body);
  res
    .status(200)
    .json({
      message: `your personal information has been changed`,
      user: findUserByUsername(req.body.username)[0]
    });
});

usersApiRoute.post("/api/user/delete", (req: Request, res: Response) => {
  deleteUserByUsername(req.body.username);
  res
    .status(200).json({
    message: `user ${req.body.username} has been deleted`,
  });
});