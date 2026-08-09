import vine from "@vinejs/vine";

import * as c from "../../constraint-constants";

const id = vine.number();
const label = vine.string().minLength(1).maxLength(c.PRODUCT.LABEL_MAX);
const is_available = vine.boolean().optional();
const excl_vat_price = vine.number().min(c.PRODUCT.EXCL_VAT_PRICE_MIN);
const picture = vine.string().optional();
const category_id = vine.number();
const event_id = vine.number();

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductIdSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *          required:
 *              - id
 */
const productIdSchema = vine.object({
    id
});

const productSearchSchema = vine.object({
    search: vine.string().optional(),
    offset: vine.number().min(0).max(10000).optional(),
    limit: vine.number().min(1).max(40).optional()
});

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductToAdd:
 *          type: object
 *          properties:
 *              label:
 *                  type: string
 *              is_available:
 *                  type: boolean
 *              excl_vat_price:
 *                  type: number
 *              category_id:
 *                  type: integer
 *              picture:
 *                  type: string
 *              event_id:
 *                  type: integer
 *          required:
 *              - label
 *              - excl_vat_price
 *              - category_id
 *              - event_id
 */
const productCreationSchema = vine.object({
    label,
    is_available,
    excl_vat_price,
    category_id,
    picture,
    event_id
});

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductToUpdate:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              label:
 *                  type: string
 *              is_available:
 *                  type: boolean
 *              excl_vat_price:
 *                  type: number
 *              category_id:
 *                  type: integer
 *              picture:
 *                  type: string
 *          required:
 *              - id
 */
const productUpdateSchema = vine.object({
    id,
    label: label.optional(),
    is_available: is_available,
    excl_vat_price: excl_vat_price.optional(),
    category_id: category_id.optional(),
    picture
});

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductsByEventSchema:
 *          type: object
 *          properties:
 *              event_id:
 *                  type: integer
 *          required:
 *              - event_id
 */
const productsByEventSchema = vine.object({
    event_id
});

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductToDelete:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *          required:
 *              - id
 */
const productDeletionSchema = vine.object({
    id
});

export const productSearch = vine.create(productIdSchema),
    productsSearch = vine.create(productSearchSchema),
    productCreation = vine.create(productCreationSchema),
    productUpdate = vine.create(productUpdateSchema),
    productDeletion = vine.create(productDeletionSchema),
    productsByEvent = vine.create(productsByEventSchema);
