import { Router, Request, Response } from "express";
import { writeTransferToFile } from "../../utils/writeTransfer.js";
import { modifyUserFields } from "../../utils/modifyUserFields.js";
import { findUserByUsername } from "../../utils/getUser.js";
export const topUpApiRoute = Router();

topUpApiRoute.get("/api/topup", (req: Request, res: Response) => {
  res.send("api topup page");
});

topUpApiRoute.post("/api/topup", (req: Request, res: Response) => {
  const topUpUser = findUserByUsername(
    req.body.user
  );

  if (topUpUser.length > 0) {
    writeTransferToFile(req.body);
    modifyUserFields(req.body.user, {
      balance: parseInt(topUpUser[0].balance) + parseInt(req.body.transferValue),
    });
    res
      .status(200)
      .json({
        message: `your top up with id ${req.body.transferId} has been accepted`,
        user: findUserByUsername(req.body.user)[0],
      });
  } else {
    res.json({
      message: `Your top up has not been processed. Contact administrator`, user: findUserByUsername(req.body.transferSender)[0],
    });
  }
});
