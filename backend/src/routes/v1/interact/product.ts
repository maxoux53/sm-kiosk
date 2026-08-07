import { Router } from 'express';

import {
    getProduct,
    getAllProducts
} from "../../../controller/product";

import { isAdmin } from "../../../middleware/identification";
import { productVal } from '../../../middleware/validation/validator';

const router = Router();

/**
 * @swagger
 * /v1/interact/product/{id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Product
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the product to get
 *      responses:
 *          200:
 *              $ref: '#/components/responses/Product'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: product not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get('/:id', productVal.get, getProduct);

/**
 * @swagger
 * /v1/interact/product:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Product
 *      parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           required: false
 *           description: Search term for filtering products
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
 *              $ref: '#/components/responses/ProductList'
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
router.get('/', isAdmin, productVal.getAll, getAllProducts);

export default router;
