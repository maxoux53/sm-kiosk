import { Router } from "express";

import { default as interactRouter } from "./interact/index";

import { login, createUser } from "../../controller/user";
import { upload } from "../../controller/image"

import { userVal } from "../../middleware/validation/validator";
import { checkJWT } from "../../middleware/identification";

const router = Router();

router.post("/login", userVal.login, login);
router.post("/signup", userVal.create, createUser);
router.get("/img-upload", upload);

router.use("/interact", checkJWT, interactRouter);

export default router;
