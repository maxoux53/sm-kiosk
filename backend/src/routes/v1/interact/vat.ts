import { Router } from 'express';

import { 
    getVat,
    getAllVats,
    createVat,
    updateVat,
    deleteVat

} from '../../../controller/vat';

import { isAdmin } from '../../../middleware/identification';
import { vatVal } from '../../../middleware/validation/validator';

const router = Router();

/**
 * @swagger
 * /v1/interact/vat/{type}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - VAT
 *      parameters:
 *         - in: path
 *           name: type
 *           schema:
 *             type: string
 *           required: true
 *           description: VAT type code (single character) to get
 *      responses:
 *          200:
 *              $ref: '#/components/responses/Vat'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: VAT not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get('/:type', vatVal.get, getVat);

/**
 * @swagger
 * /v1/interact/vat:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - VAT
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VatToAdd'
 *      responses:
 *          201:
 *              description: VAT created
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
router.post('/', isAdmin, vatVal.create, createVat);

/**
 * @swagger
 * /v1/interact/vat/{type}:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - VAT
 *      parameters:
 *         - in: path
 *           name: type
 *           schema:
 *             type: string
 *           required: true
 *           description: VAT type code (single character) to update
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VatToUpdate'
 *      responses:
 *          204:
 *              description: VAT updated
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
router.patch('/:type', isAdmin, vatVal.update, updateVat);

/**
 * @swagger
 * /v1/interact/vat:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - VAT
 *      parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           required: false
 *           description: Search term for filtering VATs
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
 *              $ref: '#/components/responses/VatList'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get('/', vatVal.getAll, getAllVats);

/**
 * @swagger
 * /v1/interact/vat/{type}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - VAT
 *      parameters:
 *         - in: path
 *           name: type
 *           schema:
 *             type: string
 *           required: true
 *           description: VAT type code (single character) to delete
 *      responses:
 *          204:
 *              description: VAT deleted
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
router.delete('/:type', isAdmin, vatVal.delete, deleteVat);

export default router;
