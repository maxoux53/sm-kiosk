import { Router } from "express";

import {
    getCategory,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../../../controller/category";

import { replaceCategoryPicture } from "../../../middleware/image-replacement";
import { isAdmin } from "../../../middleware/identification";
import { categoryVal } from "../../../middleware/validation/validator";

const router = Router();

/**
 * @swagger
 * /v1/interact/category/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Category
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the category to get
 *      responses:
 *          200:
 *              $ref: '#/components/responses/Category'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: category not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/:id", categoryVal.get, getCategory);

/**
 * @swagger
 * /v1/interact/category:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Category
 *      parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           required: false
 *           description: Search term for filtering categories
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
 *              $ref: '#/components/responses/CategoryList'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/", categoryVal.getAll, getAllCategories);

/**
 * @swagger
 * /v1/interact/category:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Category
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CategoryToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/CategoryAdded'
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
router.post("/", isAdmin, categoryVal.create, createCategory);

/**
 * @swagger
 * /v1/interact/category/{id}:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Category
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the category to update
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CategoryToUpdate'
 *      responses:
 *          204:
 *              description: category updated
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
router.patch(
    "/:id",
    isAdmin,
    categoryVal.update,
    replaceCategoryPicture,
    updateCategory
);

/**
 * @swagger
 * /v1/interact/category/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Category
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the category to delete
 *      responses:
 *          204:
 *              description: category deleted
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
router.delete("/:id", isAdmin, categoryVal.delete, deleteCategory);

export default router;
