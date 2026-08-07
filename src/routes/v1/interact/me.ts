import { Router } from "express";

import { getUser, updateUser, deleteUser } from "../../../controller/user";
import {
    getPurchasesByUser,
    createPurchase
} from "../../../controller/purchase";
import { getEventsByUser, createEvent } from "../../../controller/event";
import { joinEvent, deleteMembership } from "../../../controller/membership";

import { replaceUserAvatar } from "../../../middleware/image-replacement";
import { purchaseVal, userVal } from "../../../middleware/validation/validator";
import { eventVal } from "../../../middleware/validation/validator";
import { membershipVal } from "../../../middleware/validation/validator";

const router = Router();

/**
 * @swagger
 * /v1/interact/me:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
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
router.get("/", getUser);

/**
 * @swagger
 * /v1/interact/me:
 *  patch:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
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
 *          500:
 *              description: Error server
 */
router.patch("/", userVal.update, replaceUserAvatar, updateUser);

/**
 * @swagger
 * /v1/interact/me:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
 *      responses:
 *          204:
 *              description: user deleted
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.delete("/", deleteUser);

/**
 * @swagger
 * /v1/interact/me/event:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/EventToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/EventAdded'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.post("/event", eventVal.create, createEvent);

/**
 * @swagger
 * /v1/interact/me/events:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
 *      responses:
 *          200:
 *              $ref: '#/components/responses/EventList'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/events", getEventsByUser);

/**
 * @swagger
 * /v1/interact/me/purchases:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PurchaseList'
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.get("/purchases", getPurchasesByUser);

/**
 * @swagger
 * /v1/interact/me/purchase:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
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
router.post("/purchase", purchaseVal.create, createPurchase);

/**
 * @swagger
 * /v1/interact/me/event/{event_id}:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event to join
 *      responses:
 *          201:
 *              description: joined event successfully
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.post("/event/:event_id", membershipVal.join, joinEvent);

/**
 * @swagger
 * /v1/interact/me/event/{event_id}:
 *  delete:
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Me
 *      parameters:
 *         - in: path
 *           name: event_id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Numeric ID of the event to leave
 *      responses:
 *          204:
 *              description: left event successfully
 *          400:
 *              description: the error(s) described
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          500:
 *              description: Error server
 */
router.delete("/event/:event_id", membershipVal.delete, deleteMembership);

export default router;
