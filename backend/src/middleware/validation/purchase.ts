import vine from '@vinejs/vine'

const id = vine.number();
const event_id = vine.number()

const purchaseIdSchema = vine.object({
    id
});

const purchasesSearchSchema = vine.object({
    search: vine.string().optional(),
    offset: vine.number().min(0).max(10000).optional(),
    limit: vine.number().min(1).max(40).optional()
});

const purchasesByEventSchema = vine.object({
    event_id
});

const orderLineSchema = vine.object({
  product_id: vine.number(),
  quantity: vine.number().min(1)
});
const purchaseCreationSchema = vine.object({
  order_lines: vine.array(orderLineSchema).minLength(1)
});


export const
    purchaseSearch = vine.create(purchaseIdSchema),
    purchasesSearch = vine.create(purchasesSearchSchema),
    purchaseDeletion = vine.create(purchaseIdSchema),
    purchasesByEvent = vine.create(purchasesByEventSchema),
    purchaseCreation = vine.create(purchaseCreationSchema)
;
