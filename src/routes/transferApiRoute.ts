import { Router, Request, Response } from "express";
import { writeTransferToFile } from "../../utils/writeTransfer.js";
import { modifyUserFields } from "../../utils/modifyUserFields.js";

export const transferApiRoute = Router();

transferApiRoute.get("/api/transfer", (req: Request, res: Response) => {
  res.send("api transfer page");
});

transferApiRoute.post("/api/transfer", (req: Request, res: Response) => {
    writeTransferToFile(req.body);
    modifyUserFields(req.body.transferSender, req.body.balance);
    modifyUserFields(req.body.transferReceiver, req.body.balance);
    res.status(200).json({ message: `your transfer with id ${req.body.transferId} has been sent at ${req.body.transferDate}` });
});
