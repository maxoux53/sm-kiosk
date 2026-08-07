import vine from '@vinejs/vine'

import * as c from '../../../../shared/constraint-constants';

const id = vine.number();
const label = vine.string().minLength(1).maxLength(c.CATEGORY.LABEL_MAX);
const vat_type = vine.string().minLength(1).maxLength(c.VAT.TYPE_MAX);
const picture = vine.string();

/**
 * @swagger
 * components:
 *  schemas:
 *      CategoryIdSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *          required:
 *              - id
 */
const categoryIdSchema = vine.object({
    id
});

const categorySearchSchema = vine.object({
    search: vine.string().optional(),
    offset: vine.number().min(0).max(10000).optional(),
    limit: vine.number().min(1).max(40).optional()
});

/**
 * @swagger
 * components:
 *  schemas:
 *      CategoryToAdd:
 *          type: object
 *          properties:
 *              label:
 *                  type: string
 *              vat_type:
 *                  type: string
 *              picture:
 *                  type: string
 *          required:
 *              - label
 *              - vat_type
 *              - picture
 */
const categoryCreationSchema = vine.object({
    label,
    vat_type,
    picture
});

/**
 * @swagger
 * components:
 *  schemas:
 *      CategoryToUpdate:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              label:
 *                  type: string
 *              vat_type:
 *                  type: string
 *              picture:
 *                  type: string
 *          required:
 *              - id
 */
const categoryUpdateSchema = vine.object({
    id,
    label: label.optional(),
    vat_type: vat_type.optional(),
    picture: picture.optional()
});

export const
    categorySearch = vine.create(categoryIdSchema),
    categoriesSearch = vine.create(categorySearchSchema),
    categoryCreation = vine.create(categoryCreationSchema),
    categoryUpdate = vine.create(categoryUpdateSchema),
    categoryDeletion = vine.create(categoryIdSchema)
;
