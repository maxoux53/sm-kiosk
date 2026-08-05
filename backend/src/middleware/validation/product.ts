import vine from '@vinejs/vine'

import * as c from '../../../../shared/constraint.constants';

const id = vine.number();
const label = vine.string().minLength(1).maxLength(c.PRODUCT.LABEL_MAX);
const is_available = vine.boolean().optional();
const excl_vat_price = vine.number().min(c.PRODUCT.EXCL_VAT_PRICE_MIN);
const picture = vine.string().optional();
const category_id = vine.number();
const event_id = vine.number();

const productIdSchema = vine.object({
    id
});

const productCreationSchema = vine.object({
    label,
    is_available,
    excl_vat_price,
    category_id,
    picture,
    event_id
});

const productUpdateSchema = vine.object({
    id,
    label: label.optional(),
    is_available: is_available,
    excl_vat_price: excl_vat_price.optional(),
    category_id: category_id.optional(),
    picture
});

const productsByEventSchema = vine.object({
    event_id
});

export const
    productSearch = vine.create(productIdSchema),
    productCreation = vine.create(productCreationSchema),
    productUpdate = vine.create(productUpdateSchema),
    productDeletion = vine.create(productIdSchema),
    productsByEvent = vine.create(productsByEventSchema)
;
