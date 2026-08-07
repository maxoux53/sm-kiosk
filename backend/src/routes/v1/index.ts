import { Router } from "express";

import { default as interactRouter } from "./interact/index";

import { login, createUser } from "../../controller/user";
import { upload } from "../../controller/image"

import { userVal } from "../../middleware/validation/validator";
import { checkJWT } from "../../middleware/identification";

const router = Router();

/**
 * @swagger
 * /v1/login:
 *  post:
 *      tags:
 *          - Auth
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginRequest'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/LoginSuccess'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          500:
 *              description: Error server
 */
router.post("/login", userVal.login, login);

/**
 * @swagger
 * /v1/signup:
 *  post:
 *      tags:
 *          - Auth
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/UserAdded'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.post("/signup", userVal.create, createUser);

/**
 * @swagger
 * /v1/img-upload:
 *  get:
 *      tags:
 *          - Image
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ImageUploadUrl'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/img-upload", upload);

router.use("/interact", checkJWT, interactRouter);

export default router;
