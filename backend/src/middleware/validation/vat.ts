import vine from '@vinejs/vine'

import * as c from '../../../../shared/constraint.constants';

const type = vine.string().minLength(1).maxLength(c.VAT.TYPE_MAX);
const rate = vine.number().min(c.VAT.RATE_MIN).max(c.VAT.RATE_MAX);

/**
 * @swagger
 * components:
 *  schemas:
 *      VatTypeSchema:
 *          type: object
 *          properties:
 *              type:
 *                  type: string
 *          required:
 *              - type
 */
const vatIdSchema = vine.object({
    type
});

const vatsSearchSchema = vine.object({
    search: vine.string().optional(),
    offset: vine.number().min(0).max(10000).optional(),
    limit: vine.number().min(1).max(40).optional()
});

/**
 * @swagger
 * components:
 *  schemas:
 *      VatToAdd:
 *          type: object
 *          properties:
 *              type:
 *                  type: string
 *              rate:
 *                  type: integer
 *          required:
 *              - type
 *              - rate
 */
const vatCreationSchema = vine.object({
    type,
    rate
});

/**
 * @swagger
 * components:
 *  schemas:
 *      VatToUpdate:
 *          type: object
 *          properties:
 *              type:
 *                  type: string
 *              rate:
 *                  type: integer
 *          required:
 *              - type
 */
const vatUpdateSchema = vine.object({
    type,
    rate
});

export const
    vatSearch = vine.create(vatIdSchema),
    vatsSearch = vine.create(vatsSearchSchema),
    vatCreation = vine.create(vatCreationSchema),
    vatUpdate = vine.create(vatUpdateSchema),
    vatDeletion = vine.create(vatIdSchema)
;
