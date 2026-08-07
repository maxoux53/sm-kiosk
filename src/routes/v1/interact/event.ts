import { Router } from "express";

import {
    getEvent,
    getAllEvents,
    updateEvent,
    deleteEvent
} from "../../../controller/event";
import {
    createProduct,
    getProductsByEvent,
    updateProduct,
    deleteProduct
} from "../../../controller/product";
import { getPurchasesByEvent } from "../../../controller/purchase";
import {
    createMembership,
    deleteCashierFromEvent,
    getAllCashiersByEvent
} from "../../../controller/membership";

import {
    eventVal,
    membershipVal,
    productVal,
    purchaseVal
} from "../../../middleware/validation/validator";

import {
    replaceEventImage,
    replaceProductPicture
} from "../../../middleware/image-replacement";

import { isAdmin, isHost, isCashier } from "../../../middleware/identification";

const router = Router();

/**
 * @swagger
 * /v1/interact/event/{event_id}:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Event
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event to get
 *      responses:
 *          200:
 *              $ref: '#/components/responses/Event'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          404:
 *              description: event not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/:event_id", eventVal.get, getEvent);

/**
 * @swagger
 * /v1/interact/event/{event_id}:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Event
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event to update
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/EventToUpdate'
 *      responses:
 *          204:
 *              description: event updated
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
    "/:event_id",
    isHost,
    eventVal.update,
    replaceEventImage,
    updateEvent
);

/**
 * @swagger
 * /v1/interact/event:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Event
 *      parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           required: false
 *           description: Search term for filtering events
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
 *              $ref: '#/components/responses/EventList'
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
router.get("/", isAdmin, eventVal.getAll, getAllEvents);

/**
 * @swagger
 * /v1/interact/event/{event_id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Event
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event to delete
 *      responses:
 *          204:
 *              description: event deleted
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
router.delete("/:event_id", eventVal.delete, isHost, deleteEvent);

/**
 * @swagger
 * /v1/interact/event/{event_id}/cashier:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Membership
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/MembershipToAdd'
 *      responses:
 *          201:
 *              description: cashier added to event
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: user not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.post(
    "/:event_id/cashier",
    membershipVal.create,
    isHost,
    createMembership
);

/**
 * @swagger
 * /v1/interact/event/{event_id}/cashiers:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Membership
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event
 *      responses:
 *          200:
 *              $ref: '#/components/responses/CashierList'
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
router.get(
    "/:event_id/cashiers",
    membershipVal.getCashiersByEvent,
    isHost,
    getAllCashiersByEvent
);

/**
 * @swagger
 * /v1/interact/event/{event_id}/cashier:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Membership
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/MembershipToDelete'
 *      responses:
 *          204:
 *              description: cashier removed from event
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
router.delete(
    "/:event_id/cashier",
    membershipVal.delete,
    isHost,
    deleteCashierFromEvent
);

/**
 * @swagger
 * /v1/interact/event/{event_id}/products:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Product
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ProductList'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/:event_id/products", productVal.getByEvent, getProductsByEvent);

/**
 * @swagger
 * /v1/interact/event/{event_id}/product:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Product
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ProductToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/ProductAdded'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              description: category not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.post("/:event_id/product", productVal.create, isHost, createProduct);

/**
 * @swagger
 * /v1/interact/event/{event_id}/product/{product_id}:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Product
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event
 *         - in: path
 *           name: product_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the product to update
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ProductToUpdate'
 *      responses:
 *          204:
 *              description: product updated
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
    "/:event_id/product/:product_id",
    productVal.update,
    isCashier,
    replaceProductPicture,
    updateProduct
);

/**
 * @swagger
 * /v1/interact/event/{event_id}/product/{product_id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Product
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event
 *         - in: path
 *           name: product_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the product to delete
 *      responses:
 *          204:
 *              description: product deleted
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
router.delete("/:event_id/product/:product_id", productVal.delete, isHost, deleteProduct);

/**
 * @swagger
 * /v1/interact/event/{event_id}/purchases:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Purchase
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event
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
router.get(
    "/:event_id/purchases",
    purchaseVal.getByEvent,
    isCashier,
    getPurchasesByEvent
);

export default router;
