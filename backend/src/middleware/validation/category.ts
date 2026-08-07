import vine from '@vinejs/vine'

import * as c from '../../../../shared/constraint.constants';

const id = vine.number();
const label = vine.string().minLength(1).maxLength(c.CATEGORY.LABEL_MAX);
const vat_type = vine.string().minLength(1).maxLength(c.VAT.TYPE_MAX);
const picture = vine.string();

const categoryIdSchema = vine.object({
    id
});

const categorySearchSchema = vine.object({
    search: vine.string().optional(),
    offset: vine.number().min(0).max(10000).optional(),
    limit: vine.number().min(1).max(40).optional()
});

const categoryCreationSchema = vine.object({
    label,
    vat_type,
    picture
});

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
