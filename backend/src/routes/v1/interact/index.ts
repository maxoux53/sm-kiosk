import { Router } from "express";

import { default as productRouter } from "./product";
import { default as categoryRouter } from "./category";
import { default as eventRouter } from "./event";
import { default as purchaseRouter } from "./purchase";
import { default as userRouter } from "./user";
import { default as vatRouter } from "./vat";
import { default as personalRouter } from "./me";

import { self, isAdmin } from "../../../middleware/identification";

const router = Router();

router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/event", eventRouter);
router.use("/purchase", isAdmin, purchaseRouter);
router.use("/user", userRouter);
router.use("/vat", vatRouter);
router.use("/me", self, personalRouter);

export default router;
