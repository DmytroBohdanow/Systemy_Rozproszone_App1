import { Router, Request, Response } from "express";
import { writeTransferToFile } from "../../utils/writeTransfer.js";
import { modifyUserFields } from "../../utils/modifyUserFields.js";
import { findUserByUsername } from "../../utils/getUser.js";
import { getTransfersByUser } from "../../utils/getTransfersForUser.js";
export const transferApiRoute = Router();

transferApiRoute.get("/api/transfer", (req: Request, res: Response) => {
  res.send("api transfer page");
});

transferApiRoute.post("/api/transfer", (req: Request, res: Response) => {
  const transferDestinationUser = findUserByUsername(
    req.body.transferDestination
  );
  const transferSenderUser = findUserByUsername(
    req.body.transferSender
  );
  if (req.body.transferDestination === req.body.transferSender) {
    res.json({
      error: true, message: `Your transfer has not been processed. You can't send transfer to your own account`, user: findUserByUsername(req.body.transferSender)[0],
    });
    return;
  }
  if (parseInt(transferSenderUser[0].balance) - parseInt(req.body.transferValue) < 0) {
    res.json({
      error: true, message: `Your transfer has not been processed. You have not enough funds, top up first`, user: findUserByUsername(req.body.transferSender)[0],
    });
    return;
  }
  if (transferDestinationUser.length > 0) {
    writeTransferToFile(req.body);
    modifyUserFields(req.body.transferSender, { balance: parseInt(transferSenderUser[0].balance) - parseInt(req.body.transferValue) });
    modifyUserFields(req.body.transferDestination, {
      balance: parseInt(transferDestinationUser[0].balance) + parseInt(req.body.transferValue),
    });
    res
      .status(200)
      .json({
        message: `your transfer with id ${req.body.transferId} has been sent at ${req.body.transferDate}`,
        user: findUserByUsername(req.body.transferSender)[0],
      });
      return;
  } else {
    res.json({
      error: true, message: `Your transfer has not been processed. ${req.body.transferDestination} user was not found`, user: findUserByUsername(req.body.transferSender)[0],
    });
    return;
  }
});

transferApiRoute.post("/api/transfers/byuser", (req: Request, res: Response) => {
  const transfers = getTransfersByUser(req.body.username);
  res.status(200).json({
    transfers: transfers
  })
});
