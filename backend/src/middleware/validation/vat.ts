import vine from '@vinejs/vine'

import * as c from '../../../../shared/constraint.constants';

const type = vine.string().minLength(1).maxLength(c.VAT.TYPE_MAX);
const rate = vine.number().min(c.VAT.RATE_MIN).max(c.VAT.RATE_MAX);

const vatIdSchema = vine.object({
    type
});

const vatsSearchSchema = vine.object({
    search: vine.string().optional(),
    offset: vine.number().min(0).max(10000).optional(),
    limit: vine.number().min(1).max(40).optional()
});

const vatCreationSchema = vine.object({
    type,
    rate
});

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
