import vine from "@vinejs/vine";

import * as c from "../../constraint-constants";

const event_id = vine.number();
const name = vine.string().minLength(1).maxLength(c.EVENT.NAME_MAX);
const location = vine.string().minLength(1).maxLength(c.EVENT.LOCATION_MAX);
const image = vine.string().optional();
const is_active = vine.boolean().optional();
const iban = vine.string().minLength(1).maxLength(c.EVENT.IBAN_MAX);

/**
 * @swagger
 * components:
 *  schemas:
 *      EventIdSchema:
 *          type: object
 *          properties:
 *              event_id:
 *                  type: integer
 *          required:
 *              - event_id
 */
const eventIdSchema = vine.object({
    event_id
});

const eventsSearchSchema = vine.object({
    search: vine.string().optional(),
    offset: vine.number().min(0).max(10000).optional(),
    limit: vine.number().min(1).max(40).optional()
});

/**
 * @swagger
 * components:
 *  schemas:
 *      EventToAdd:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              location:
 *                  type: string
 *              image:
 *                  type: string
 *              is_active:
 *                  type: boolean
 *              iban:
 *                  type: string
 *          required:
 *              - name
 *              - location
 *              - iban
 */
const eventCreatedSchema = vine.object({
    name,
    location,
    image,
    is_active,
    iban
});

/**
 * @swagger
 * components:
 *  schemas:
 *      EventToUpdate:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              location:
 *                  type: string
 *              image:
 *                  type: string
 *              is_active:
 *                  type: boolean
 *              iban:
 *                  type: string
 *          required:
 *              - id
 */
const eventUpdatedSchema = vine.object({
    id: vine.number(),
    name: name.optional(),
    location: location.optional(),
    image,
    is_active,
    iban: iban.optional()
});

export const eventSearch = vine.create(eventIdSchema),
    eventsSearch = vine.create(eventsSearchSchema),
    eventCreation = vine.create(eventCreatedSchema),
    eventUpdate = vine.create(eventUpdatedSchema),
    eventDeletion = vine.create(eventIdSchema);
