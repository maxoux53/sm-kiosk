import { Router } from "express";

import {
    getPurchase,
    getAllPurchases,
    createPurchase,
    deletePurchase
} from "../../../controller/purchase";

import { purchaseVal } from "../../../middleware/validation/validator";
import { isAdmin } from "../../../middleware/identification";

const router = Router();

/**
 * @swagger
 * /v1/interact/purchase/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Purchase
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the purchase to get
 *      responses:
 *          200:
 *              $ref: '#/components/responses/Purchase'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: purchase not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/:id", purchaseVal.get, getPurchase);

/**
 * @swagger
 * /v1/interact/purchase:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Purchase
 *      parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           required: false
 *           description: Search term for filtering purchases
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
 *              $ref: '#/components/responses/PurchaseList'
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
router.get("/", isAdmin, purchaseVal.getAll, getAllPurchases);

/**
 * @swagger
 * /v1/interact/purchase:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Purchase
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PurchaseToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/PurchaseAdded'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.post("/", createPurchase);

/**
 * @swagger
 * /v1/interact/purchase/{id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Purchase
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the purchase to delete
 *      responses:
 *          204:
 *              description: purchase deleted
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.delete("/:id", purchaseVal.delete, deletePurchase);

export default router;
