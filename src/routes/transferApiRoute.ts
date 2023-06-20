import { Router, Request, Response } from "express";
import { writeTransferToFile } from "../../utils/writeTransfer.js";
import { modifyUserFields } from "../../utils/modifyUserFields.js";
import { findUserByUsername } from "../../utils/getUser.js";
export const transferApiRoute = Router();

transferApiRoute.get("/api/transfer", (req: Request, res: Response) => {
  res.send("api transfer page");
});

transferApiRoute.post("/api/transfer", (req: Request, res: Response) => {
  const transferDestinationUser = findUserByUsername(
    req.body.transferDestination
  );
  if (transferDestinationUser.length > 0) {
    writeTransferToFile(req.body);
    modifyUserFields(req.body.transferSender, { balance: req.body.balance });
    modifyUserFields(req.body.transferDestination, {
      balance: parseInt(transferDestinationUser[0].balance) + parseInt(req.body.transferValue),
    });
    res
      .status(200)
      .json({
        message: `your transfer with id ${req.body.transferId} has been sent at ${req.body.transferDate}`,
        user: findUserByUsername(req.body.transferSender)[0],
      });
  } else {
    res.json({
      message: `Your transfer has not been processed. ${req.body.transferDestination} was not found`, user: findUserByUsername(req.body.transferSender)[0],
    });
  }
});
