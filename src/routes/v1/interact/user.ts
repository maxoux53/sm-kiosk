import { Router } from "express";

import {
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} from "../../../controller/user";

import { replaceUserAvatar } from "../../../middleware/image-replacement";
import { isAdmin } from "../../../middleware/identification";
import { userVal } from "../../../middleware/validation/validator";

const router = Router();

/**
 * @swagger
 * /v1/interact/user/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the user to get
 *      responses:
 *          200:
 *              $ref: '#/components/responses/User'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: user not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/:id", userVal.get, getUser);

/**
 * @swagger
 * /v1/interact/user:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User
 *      parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           required: false
 *           description: Search term for filtering users
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           required: false
 *           description: Pagination offset
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           required: false
 *           description: Pagination limit
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserList'
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
router.get("/", isAdmin, userVal.getAll, getAllUsers);

/**
 * @swagger
 * /v1/interact/user:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User
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
router.post("/", userVal.create, createUser);

/**
 * @swagger
 * /v1/interact/user/{id}:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the user to update
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserToUpdate'
 *      responses:
 *          204:
 *              description: user updated
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
router.patch("/:id", isAdmin, userVal.update, replaceUserAvatar, updateUser);

/**
 * @swagger
 * /v1/interact/user/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the user to delete
 *      responses:
 *          204:
 *              description: user deleted
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
router.delete("/:id", isAdmin, userVal.delete, deleteUser);

export default router;
